import { beforeEach, describe, expect, it } from 'vitest';
import { GameController } from '../game/gameController';

describe('GameController & Session Logic', () => {
  let controller: GameController;

  beforeEach(() => {
    controller = new GameController();
  });

  it('TIM-01: WELCOME state has timer stopped at 180s', () => {
    expect(controller.getSession().status).toBe('welcome');
    expect(controller.getRemainingMs()).toBe(180_000);
  });

  it('TIM-02 & TIM-04: startNewGame sets active status and absolute deadline', () => {
    controller.startNewGame('Tester');
    const sess = controller.getSession();

    expect(sess.status).toBe('active');
    expect(sess.alias).toBe('Tester');
    expect(sess.startedAt).toBeDefined();
    expect(sess.deadlineAt).toBe(sess.startedAt! + 180_000);
    expect(controller.getRemainingMs()).toBeGreaterThan(179_000);
    expect(controller.getRemainingMs()).toBeLessThanOrEqual(180_000);
  });

  it('TIM-07: Blocks mutations when deadline passes', () => {
    controller.startNewGame('Tester');
    // Force deadline into past
    controller.getSession().deadlineAt = Date.now() - 1000;

    // Remaining ms should trigger timeout and transition to results
    expect(controller.getRemainingMs()).toBe(0);
    expect(controller.getSession().status).toBe('results');

    // Any mutation should be rejected
    const res = controller.archiveMessages(['msg_mail001']);
    expect(res).toBe(false);
  });

  it('TIM-08: Voluntary finish ends game and records ranking without time bonus', () => {
    controller.startNewGame('Agente');
    controller.finishGame('voluntary');

    expect(controller.getSession().status).toBe('results');
    expect(controller.getSession().finishedAt).toBeDefined();
  });

  it('Scores each case once and prevents farming points', () => {
    controller.startNewGame('Tester');
    const initialScore = controller.getSession().score;

    // Move msg_mail001 to trash then delete permanently (optimal resolution for MAIL-001)
    controller.permanentlyDeleteMessages(['msg_mail001']);

    const afterFirstDelete = controller.getSession().score;
    expect(afterFirstDelete).toBe(initialScore + 100); // +100 optimal

    // Try deleting again
    controller.permanentlyDeleteMessages(['msg_mail001']);
    const afterSecondDelete = controller.getSession().score;
    expect(afterSecondDelete).toBe(afterFirstDelete); // No double scoring!
  });

  it('Builds streak bonus on consecutive positive resolutions and resets on critical', () => {
    controller.startNewGame('StreakTest');

    // 1st positive resolution: MAIL-001 (+100, streak 0 -> bonus 0, next streak 1)
    controller.permanentlyDeleteMessages(['msg_mail001']);
    expect(controller.getSession().score).toBe(100);
    expect(controller.getSession().currentStreak).toBe(1);

    // 2nd positive resolution: MAIL-002 (+100, streak 1 -> bonus +10 => +110)
    controller.archiveMessages(['msg_mail002']);
    expect(controller.getSession().score).toBe(100 + 110);
    expect(controller.getSession().currentStreak).toBe(2);

    // Harmful or critical resolution: CON-003 merge two distinct people (-200 critical)
    controller.mergeContacts('cnt_con003_a', ['cnt_con003_b'], {});
    expect(controller.getSession().score).toBe(210 - 200);
    expect(controller.getSession().currentStreak).toBe(0); // Reset to 0!
  });

  it('Merges contacts and preserves complementary information', () => {
    controller.startNewGame('MergeTest');

    // CON-002: Marcos Ruiz (prim has phone, sec has role and dept)
    const success = controller.mergeContacts('cnt_con002_prim', ['cnt_con002_sec'], {
      role: 'Jefe de Secretaría',
      department: 'Extensión Universitaria',
    });

    expect(success).toBe(true);

    const prim = controller.getDataset().contacts.find((c) => c.id === 'cnt_con002_prim')!;
    const sec = controller.getDataset().contacts.find((c) => c.id === 'cnt_con002_sec')!;

    expect(prim.phone).toBe('+34 611 223 344');
    expect(prim.role).toBe('Jefe de Secretaría');
    expect(sec.status).toBe('merged');
    expect(sec.mergedIntoContactId).toBe('cnt_con002_prim');
  });

  it('Reset restores pristine dataset while preserving local ranking', async () => {
    controller.startNewGame('RankingTester');
    controller.permanentlyDeleteMessages(['msg_mail001']);
    controller.finishGame('voluntary');

    const rankingBefore = controller.getRanking();
    expect(rankingBefore.length).toBeGreaterThan(0);

    await controller.resetGame();

    expect(controller.getSession().status).toBe('welcome');
    expect(controller.getDataset().mailMessages.length).toBe(320);
    expect(controller.getStorageMetrics().usedBytes).toBe(34_000_000_000);

    const rankingAfter = controller.getRanking();
    expect(rankingAfter.length).toBe(rankingBefore.length); // Ranking preserved!
  });

  it('can clear ranking while in welcome state without starting a game', () => {
    const controller = new GameController();
    expect(controller.getSession().status).toBe('welcome');

    controller.clearRanking();

    expect(controller.getSession().status).toBe('welcome');
    expect(controller.getRanking()).toEqual([]);
  });
});


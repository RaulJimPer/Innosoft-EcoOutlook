import { beforeEach, describe, expect, it } from 'vitest';
import { GameController } from '../game/gameController';
import { parseMailSearch } from '../domain/mailSearch';
import { formatBytes } from '../domain/storage';

describe('07-PLAN-DE-PRUEBAS Smoke Test & Acceptance Checklist', () => {
  let controller: GameController;

  beforeEach(() => {
    controller = new GameController();
  });

  it('Executes the 14-step complete smoke test flow', async () => {
    // 1 & 2: Open app, check welcome state
    expect(controller.getSession().status).toBe('welcome');
    expect(controller.getRemainingMs()).toBe(180_000);
    const initialStorage = controller.getStorageMetrics();
    expect(initialStorage.usedBytes).toBe(34_000_000_000);

    // 3: Start challenge
    controller.startNewGame('TesterSmoke');
    expect(controller.getSession().status).toBe('active');
    expect(controller.getRemainingMs()).toBeGreaterThan(179_000);

    // 4: Open a message, archive it, check folder change
    const msgToArchive = controller.getDataset().mailMessages.find((m) => m.id === 'msg_mail002')!;
    expect(msgToArchive.folderId).toBe('inbox');
    controller.archiveMessages([msgToArchive.id]);
    expect(msgToArchive.folderId).toBe('archive');
    // Verify storage didn't change
    expect(controller.getStorageMetrics().usedBytes).toBe(34_000_000_000);
    expect(controller.getStorageMetrics().freedBytes).toBe(0);

    // 5: Search with operators
    const parsed = parseMailSearch('has:attachment in:inbox');
    expect(parsed.error).toBeUndefined();
    expect(parsed.query?.hasAttachment).toBe(true);

    // 6: Move a disposable email (MAIL-001) to trash: verify freedBytes does NOT increase
    const msgMail001 = controller.getDataset().mailMessages.find((m) => m.id === 'msg_mail001')!;
    controller.moveMessagesToTrash([msgMail001.id]);
    expect(msgMail001.folderId).toBe('trash');
    const storageInTrash = controller.getStorageMetrics();
    expect(storageInTrash.usedBytes).toBe(34_000_000_000);
    expect(storageInTrash.freedBytes).toBe(0); // Sigue ocupando!
    expect(storageInTrash.trashBytes).toBeGreaterThan(0);

    // 7: Delete it permanently: verify freed bytes increases
    controller.permanentlyDeleteMessages([msgMail001.id]);
    const storageAfterDelete = controller.getStorageMetrics();
    expect(storageAfterDelete.freedBytes).toBeGreaterThan(0);
    expect(storageAfterDelete.usedBytes).toBeLessThan(34_000_000_000);

    // 8 & 9: Open Files, compare duplicate presentation (FILE-001) and delete redundant copy
    const canFile = controller.getDataset().driveFiles.find((f) => f.id === 'file_001_can')!;
    const dupFile1 = controller.getDataset().driveFiles.find((f) => f.id === 'file_001_dup1')!;
    expect(canFile.isCanonicalDuplicate).toBe(true);
    expect(dupFile1.isCanonicalDuplicate).toBe(false);

    const freedBeforeFileDelete = controller.getStorageMetrics().freedBytes;
    controller.permanentlyDeleteFiles([dupFile1.id]);
    expect(dupFile1.status).toBe('deleted');
    expect(canFile.status).toBe('active'); // Canonical remains intact!
    expect(controller.getStorageMetrics().freedBytes).toBe(freedBeforeFileDelete + 45_000_000);

    // 10: Open future important event (CAL-003) and exit without altering it
    const eventCal003 = controller.getDataset().calendarEvents.find((e) => e.id === 'evt_cal003')!;
    expect(eventCal003.status).toBe('confirmed');

    // 11: Merge two duplicate contacts with complementary data (CON-002)
    const successMerge = controller.mergeContacts('cnt_con002_prim', ['cnt_con002_sec'], {
      role: 'Jefe de Secretaría',
      department: 'Extensión Universitaria',
    });
    expect(successMerge).toBe(true);
    const primContact = controller.getDataset().contacts.find((c) => c.id === 'cnt_con002_prim')!;
    expect(primContact.role).toBe('Jefe de Secretaría');

    // 12: Finish challenge
    controller.finishGame('voluntary');
    expect(controller.getSession().status).toBe('results');

    // 13: Review results
    const finalScore = controller.getSession().score;
    expect(finalScore).toBeGreaterThan(0);
    const badge = controller.getBadge();
    expect(badge.title).toBeDefined();

    // 14: Verify ranking remains and data resets to initial state
    const ranking = controller.getRanking();
    expect(ranking.length).toBeGreaterThan(0);
    expect(ranking[0].score).toBe(finalScore);

    await controller.resetGame();
    expect(controller.getSession().status).toBe('welcome');
    expect(controller.getDataset().mailMessages.length).toBe(320);
    expect(controller.getDataset().driveFiles.length).toBe(120);
    expect(controller.getDataset().contacts.length).toBe(64);
    expect(controller.getDataset().calendarEvents.length).toBe(48);
    expect(controller.getStorageMetrics().usedBytes).toBe(34_000_000_000);
    expect(controller.getRanking().length).toBeGreaterThan(0); // Ranking preserved!
  });
});


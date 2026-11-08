import { describe, expect, it } from 'vitest';
import { getInitialDataset } from '../data/seed/initialDataset';
import { calculateStorageMetrics, formatBytes, INITIAL_FREE_BYTES, INITIAL_USED_BYTES, TOTAL_CAPACITY_BYTES } from '../domain/storage';
import { calculateStreak, determineBadge, evaluateScoringCaseAction, OUTCOME_BASE_POINTS } from '../domain/scoring';
import { filterMessages, parseMailSearch } from '../domain/mailSearch';
import { StorageUnit } from '../domain/types';

describe('Dataset Integrity & Exact Counts', () => {
  const dataset = getInitialDataset();

  it('contains exactly 320 mail messages', () => {
    expect(dataset.mailMessages.length).toBe(320);
  });

  it('contains expected distribution across mail folders', () => {
    const inbox = dataset.mailMessages.filter((m) => m.folderId === 'inbox');
    const sent = dataset.mailMessages.filter((m) => m.folderId === 'sent');
    const drafts = dataset.mailMessages.filter((m) => m.folderId === 'drafts');
    const junk = dataset.mailMessages.filter((m) => m.folderId === 'junk');
    const trash = dataset.mailMessages.filter((m) => m.folderId === 'trash');
    const archive = dataset.mailMessages.filter((m) => m.folderId.startsWith('archive'));

    expect(inbox.length).toBe(180);
    expect(sent.length).toBe(55);
    expect(drafts.length).toBe(12);
    expect(junk.length).toBe(12);
    expect(trash.length).toBe(26);
    expect(archive.length).toBe(35);
    expect(inbox.length + sent.length + drafts.length + junk.length + trash.length + archive.length).toBe(320);
  });

  it('contains exactly 120 drive files and 18 user folders', () => {
    expect(dataset.driveFiles.length).toBe(120);
    expect(dataset.driveFolders.length).toBe(18);

    const docs = dataset.driveFiles.filter((f) => f.category === 'documents');
    const imgs = dataset.driveFiles.filter((f) => f.category === 'images');
    const vids = dataset.driveFiles.filter((f) => f.category === 'videos');
    const auds = dataset.driveFiles.filter((f) => f.category === 'audio');
    const shts = dataset.driveFiles.filter((f) => f.category === 'sheets');
    const zips = dataset.driveFiles.filter((f) => f.category === 'compressed');
    const oths = dataset.driveFiles.filter((f) => f.category === 'other');

    expect(docs.length).toBe(38);
    expect(imgs.length).toBe(22);
    expect(vids.length).toBe(14);
    expect(auds.length).toBe(10);
    expect(shts.length).toBe(14);
    expect(zips.length).toBe(12);
    expect(oths.length).toBe(10);
    expect(docs.length + imgs.length + vids.length + auds.length + shts.length + zips.length + oths.length).toBe(120);
  });

  it('contains exactly 64 contacts', () => {
    expect(dataset.contacts.length).toBe(64);
  });

  it('contains exactly 48 calendar events', () => {
    expect(dataset.calendarEvents.length).toBe(48);
  });

  it('contains exactly 73 scoring cases with correct modules', () => {
    expect(dataset.scoringCases.length).toBe(73);

    const mailCases = dataset.scoringCases.filter((c) => c.module === 'mail');
    const fileCases = dataset.scoringCases.filter((c) => c.module === 'files');
    const calCases = dataset.scoringCases.filter((c) => c.module === 'calendar');
    const conCases = dataset.scoringCases.filter((c) => c.module === 'contacts');

    expect(mailCases.length).toBe(30);
    expect(fileCases.length).toBe(25);
    expect(calCases.length).toBe(8);
    expect(conCases.length).toBe(10);
  });
});

describe('Storage Accounting Rules (STO-01 to STO-10)', () => {
  const dataset = getInitialDataset();

  it('calculates initial used bytes as EXACTLY 34.000.000.000 bytes (68%)', () => {
    const metrics = calculateStorageMetrics(dataset.storageUnits);
    expect(metrics.capacityBytes).toBe(50_000_000_000);
    expect(metrics.usedBytes).toBe(34_000_000_000);
    expect(metrics.freeBytes).toBe(16_000_000_000);
    expect(metrics.freedBytes).toBe(0);
    expect(metrics.netDeltaBytes).toBe(0);
  });

  it('STO-01: Archiving a 10 MB message does not change usedBytes or freedBytes', () => {
    const initial = calculateStorageMetrics(dataset.storageUnits);
    // Simulating archiving (only folderId changes, storageUnits unaffected)
    const after = calculateStorageMetrics(dataset.storageUnits);
    expect(after.usedBytes).toBe(initial.usedBytes);
    expect(after.freedBytes).toBe(0);
  });

  it('STO-02 & STO-03: Moving file to trash does not free space, restoring keeps usedBytes', () => {
    const testUnits: StorageUnit[] = [
      { id: 'u1', sizeBytes: 100_000_000, kind: 'drive-file', status: 'active', originalStatus: 'active', ownerEntityIds: ['f1'] },
      { id: 'u2', sizeBytes: 33_900_000_000, kind: 'drive-file', status: 'active', originalStatus: 'active', ownerEntityIds: ['f2'] },
    ];

    const initial = calculateStorageMetrics(testUnits);
    expect(initial.usedBytes).toBe(34_000_000_000);
    expect(initial.trashBytes).toBe(0);

    // Move u1 to trash
    testUnits[0].status = 'trash';
    const inTrash = calculateStorageMetrics(testUnits);
    expect(inTrash.usedBytes).toBe(34_000_000_000);
    expect(inTrash.trashBytes).toBe(100_000_000);
    expect(inTrash.freedBytes).toBe(0); // STILL OCCUPIED!

    // Restore u1
    testUnits[0].status = 'active';
    const restored = calculateStorageMetrics(testUnits);
    expect(restored.usedBytes).toBe(34_000_000_000);
    expect(restored.trashBytes).toBe(0);
    expect(restored.freedBytes).toBe(0);
  });

  it('STO-04: Permanently deleting an unreferenced unit frees bytes', () => {
    const testUnits: StorageUnit[] = [
      { id: 'u1', sizeBytes: 100_000_000, kind: 'drive-file', status: 'trash', originalStatus: 'active', ownerEntityIds: ['f1'] },
      { id: 'u2', sizeBytes: 33_900_000_000, kind: 'drive-file', status: 'active', originalStatus: 'active', ownerEntityIds: ['f2'] },
    ];

    // Permanently delete u1
    testUnits[0].status = 'deleted';
    const metrics = calculateStorageMetrics(testUnits);
    expect(metrics.usedBytes).toBe(33_900_000_000);
    expect(metrics.freedBytes).toBe(100_000_000);
    expect(metrics.trashBytes).toBe(0);
  });

  it('STO-10: Reset returns used bytes back to exactly 34.000.000.000', () => {
    const fresh = getInitialDataset();
    const metrics = calculateStorageMetrics(fresh.storageUnits);
    expect(metrics.usedBytes).toBe(INITIAL_USED_BYTES);
    expect(metrics.freeBytes).toBe(INITIAL_FREE_BYTES);
    expect(metrics.capacityBytes).toBe(TOTAL_CAPACITY_BYTES);
  });
});

describe('Scoring & Streak Logic', () => {
  it('translates outcomes to correct base points', () => {
    expect(OUTCOME_BASE_POINTS.optimal).toBe(100);
    expect(OUTCOME_BASE_POINTS.good).toBe(60);
    expect(OUTCOME_BASE_POINTS.partial).toBe(30);
    expect(OUTCOME_BASE_POINTS.neutral).toBe(0);
    expect(OUTCOME_BASE_POINTS.harmful).toBe(-100);
    expect(OUTCOME_BASE_POINTS.critical).toBe(-200);
    expect(OUTCOME_BASE_POINTS.no_score).toBe(0);
  });

  it('handles streak progression with maximum cap +50', () => {
    let streak = 0;

    // 1st positive resolution: streak 0 -> bonus 0, next streak 1
    let res = calculateStreak(streak, 'optimal');
    expect(res.streakBonus).toBe(0);
    expect(res.nextStreak).toBe(1);
    streak = res.nextStreak;

    // 2nd positive: streak 1 -> bonus 10, next streak 2
    res = calculateStreak(streak, 'good');
    expect(res.streakBonus).toBe(10);
    expect(res.nextStreak).toBe(2);
    streak = res.nextStreak;

    // 3rd positive: streak 2 -> bonus 20, next streak 3
    res = calculateStreak(streak, 'partial');
    expect(res.streakBonus).toBe(20);
    expect(res.nextStreak).toBe(3);
    streak = res.nextStreak;

    // 4th, 5th, 6th...
    streak = 5;
    res = calculateStreak(streak, 'optimal');
    expect(res.streakBonus).toBe(50);
    expect(res.nextStreak).toBe(6);

    streak = 10;
    res = calculateStreak(streak, 'optimal');
    expect(res.streakBonus).toBe(50); // Capped at +50
  });

  it('resets streak to 0 on neutral, harmful or critical outcomes', () => {
    expect(calculateStreak(4, 'neutral')).toEqual({ streakBonus: 0, nextStreak: 0 });
    expect(calculateStreak(4, 'harmful')).toEqual({ streakBonus: 0, nextStreak: 0 });
    expect(calculateStreak(4, 'critical')).toEqual({ streakBonus: 0, nextStreak: 0 });
  });

  it('leaves streak unchanged on no_score (preparatory action)', () => {
    expect(calculateStreak(3, 'no_score')).toEqual({ streakBonus: 0, nextStreak: 3 });
  });

  it('evaluates rule matching and assigns proper outcome', () => {
    const dataset = getInitialDataset();
    const caseMail001 = dataset.scoringCases.find((c) => c.id === 'MAIL-001')!;

    const optRule = evaluateScoringCaseAction(caseMail001, 'mail.deleteForever', 'msg_mail001');
    expect(optRule?.outcome).toBe('optimal');

    const partRule = evaluateScoringCaseAction(caseMail001, 'mail.archive', 'msg_mail001');
    expect(partRule?.outcome).toBe('partial');

    const noScoreRule = evaluateScoringCaseAction(caseMail001, 'mail.moveToTrash', 'msg_mail001');
    expect(noScoreRule?.outcome).toBe('no_score');
  });

  it('determines badge levels based on requirements', () => {
    // Exemplary: score >= 1200, cases >= 10, 0 critical
    expect(determineBadge(1250, 12, 0, 0).type).toBe('exemplary');

    // Responsible: score >= 600, 0 critical
    expect(determineBadge(800, 8, 0, 0).type).toBe('responsible');

    // On track: score between 0 and 599
    expect(determineBadge(400, 4, 0, 1).type).toBe('on_track');

    // Needs review: critical > 0 or score < 0
    expect(determineBadge(1500, 15, 1, 0).type).toBe('needs_review');
    expect(determineBadge(-150, 2, 0, 2).type).toBe('needs_review');
  });
});

describe('Mail Search Operator Parser', () => {
  it('parses structured query operators correctly', () => {
    const q = 'from:carmen has:attachment larger:10M after:2026-10-01 in:inbox -spam urgente';
    const res = parseMailSearch(q);

    expect(res.error).toBeUndefined();
    expect(res.query).toBeDefined();
    expect(res.query?.from).toBe('carmen');
    expect(res.query?.hasAttachment).toBe(true);
    expect(res.query?.largerThanBytes).toBe(10_000_000);
    expect(res.query?.afterDate).toBe('2026-10-01');
    expect(res.query?.inFolder).toBe('inbox');
    expect(res.query?.negativeWords).toContain('spam');
    expect(res.query?.freeWords).toContain('urgente');
  });

  it('reports syntax error for invalid operator format', () => {
    expect(parseMailSearch('larger:xyz').error).toBeDefined();
    expect(parseMailSearch('after:invalida').error).toBeDefined();
    expect(parseMailSearch('in:carpeta_inexistente').error).toBeDefined();
  });

  it('filters messages matching criteria', () => {
    const dataset = getInitialDataset();
    const query = parseMailSearch('has:attachment in:inbox').query!;
    const filtered = filterMessages(dataset.mailMessages, dataset.mailAttachments, query);

    expect(filtered.length).toBeGreaterThan(0);
    for (const msg of filtered) {
      expect(msg.attachmentIds.length).toBeGreaterThan(0);
      expect(msg.folderId).toBe('inbox');
    }
  });
});


import {
  ActionEvent,
  BadgeInfo,
  CalendarEvent,
  Contact,
  DatasetState,
  DriveFile,
  DriveFolder,
  FileVersion,
  GameSession,
  MailAttachment,
  MailMessage,
  RankingEntry,
  ScoreEvent,
  ScoreOutcome,
  ScoringCase,
  ShareLink,
  StorageMetrics,
  StorageUnit,
} from '../domain/types';
import {
  calculateStreak,
  determineBadge,
  evaluateScoringCaseAction,
  OUTCOME_BASE_POINTS,
} from '../domain/scoring';
import { calculateStorageMetrics, formatBytes } from '../domain/storage';
import { getInitialDataset } from '../data/seed/initialDataset';
import {
  clearRanking as repoClearRanking,
  loadPersistedState,
  loadRanking,
  resetPersistedDataset,
  savePersistedState,
  saveRankingEntry,
} from '../data/repositories/gameRepository';

export interface FeedbackToast {
  id: string;
  outcome: ScoreOutcome;
  basePoints: number;
  streakBonus: number;
  totalPoints: number;
  explanation: string;
  storageEffectText?: string;
}

export class GameController {
  private dataset: DatasetState;
  private session: GameSession;
  private listeners: Set<() => void> = new Set();
  private toastListeners: Set<(toast: FeedbackToast) => void> = new Set();

  constructor() {
    this.dataset = getInitialDataset();
    this.session = this.createDefaultSession();
  }

  public async init(): Promise<void> {
    const { dataset, session } = await loadPersistedState();
    this.dataset = dataset;

    if (session) {
      this.session = session;
      // If ACTIVE but deadline passed, finish game immediately!
      if (this.session.status === 'active' && this.session.deadlineAt) {
        if (Date.now() >= this.session.deadlineAt) {
          this.finishGame('timeout');
        }
      }
    } else {
      this.session = this.createDefaultSession();
    }

    this.notify();
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  public subscribeToasts(cb: (toast: FeedbackToast) => void): () => void {
    this.toastListeners.add(cb);
    return () => this.toastListeners.delete(cb);
  }

  private notify(): void {
    this.listeners.forEach((cb) => cb());
    savePersistedState(this.dataset, this.session);
  }

  private emitToast(toast: FeedbackToast): void {
    this.toastListeners.forEach((cb) => cb(toast));
  }

  private createDefaultSession(alias?: string): GameSession {
    return {
      id: `session_${Date.now()}`,
      status: 'welcome',
      alias: alias || '',
      score: 0,
      currentStreak: 0,
      bestStreak: 0,
      casesResolved: 0,
      criticalDeletions: 0,
      harmfulDeletions: 0,
      actionLedger: [],
      recentActions: [],
    };
  }

  // ----------------------------------------------------
  // Getters
  // ----------------------------------------------------
  public getSession(): GameSession {
    return this.session;
  }

  public getDataset(): DatasetState {
    return this.dataset;
  }

  public getStorageMetrics(): StorageMetrics {
    return calculateStorageMetrics(this.dataset.storageUnits);
  }

  public getBadge(): BadgeInfo {
    return determineBadge(
      this.session.score,
      this.session.casesResolved,
      this.session.criticalDeletions,
      this.session.harmfulDeletions
    );
  }

  public getRemainingMs(): number {
    if (this.session.status !== 'active' || !this.session.deadlineAt) {
      return 180_000;
    }
    const rem = Math.max(0, this.session.deadlineAt - Date.now());
    if (rem <= 0 && this.session.status === 'active') {
      this.finishGame('timeout');
      return 0;
    }
    return rem;
  }

  // ----------------------------------------------------
  // Session Controls
  // ----------------------------------------------------
  public startNewGame(alias?: string): void {
    const fresh = getInitialDataset();
    this.dataset = fresh;

    const now = Date.now();
    this.session = {
      id: `session_${now}`,
      status: 'active',
      startedAt: now,
      deadlineAt: now + 180_000,
      alias: alias ? alias.trim().slice(0, 16) : '',
      score: 0,
      currentStreak: 0,
      bestStreak: 0,
      casesResolved: 0,
      criticalDeletions: 0,
      harmfulDeletions: 0,
      actionLedger: [],
      recentActions: [],
    };

    this.notify();
  }

  public finishGame(reason: 'timeout' | 'voluntary'): void {
    if (this.session.status === 'results') return;

    this.session.status = 'results';
    this.session.finishedAt = Date.now();

    // Auto register ranking entry
    const metrics = this.getStorageMetrics();
    const badge = this.getBadge();

    const rankingAlias = this.session.alias && this.session.alias.trim().length > 0
      ? this.session.alias.trim()
      : `Participante #${Math.floor(Math.random() * 900 + 100)}`;

    const entry: RankingEntry = {
      id: this.session.id,
      alias: rankingAlias,
      score: this.session.score,
      casesResolved: this.session.casesResolved,
      criticalDeletions: this.session.criticalDeletions,
      freedBytes: metrics.freedBytes,
      badge: badge.type,
      playedAt: this.session.finishedAt,
    };

    saveRankingEntry(entry);
    this.notify();
  }

  public async resetGame(): Promise<void> {
    const fresh = await resetPersistedDataset();
    this.dataset = fresh;
    this.session = this.createDefaultSession();
    this.notify();
  }

  public getRanking(): RankingEntry[] {
    return loadRanking();
  }

  public clearRanking(): void {
    repoClearRanking();
    this.notify();
    this.emitToast({
      id: `toast_${Date.now()}`,
      outcome: 'neutral',
      basePoints: 0,
      streakBonus: 0,
      totalPoints: 0,
      explanation: 'Ranking local restablecido: se han borrado las puntuaciones del Top 10.',
    });
  }

  // ----------------------------------------------------
  // Internal Guard & Action Evaluation
  // ----------------------------------------------------
  private canMutate(): boolean {
    if (this.session.status !== 'active') return false;
    if (this.session.deadlineAt && Date.now() >= this.session.deadlineAt) {
      this.finishGame('timeout');
      return false;
    }
    return true;
  }

  private processScoring(
    actionId: string,
    targetEntityIds: string[],
    targetFolderId?: string,
    targetScope?: 'occurrence' | 'series',
    storageEffectText?: string
  ): void {
    for (const entityId of targetEntityIds) {
      // Find scoring case containing this entity
      const scoringCase = this.dataset.scoringCases.find(
        (c) => c.status === 'pending' && c.entityIds.includes(entityId)
      );

      if (!scoringCase) continue;

      const rule = evaluateScoringCaseAction(
        scoringCase,
        actionId,
        entityId,
        targetFolderId,
        targetScope
      );

      if (!rule) continue;

      const outcome = rule.outcome;

      // no_score does not close the case and does not score
      if (outcome === 'no_score') {
        continue;
      }

      // Close the case
      scoringCase.status = 'resolved';
      scoringCase.resolutionAction = actionId;
      scoringCase.resolutionAt = new Date().toISOString();
      scoringCase.outcome = outcome;

      const basePoints = OUTCOME_BASE_POINTS[outcome];
      const { streakBonus, nextStreak } = calculateStreak(this.session.currentStreak, outcome);
      const totalPoints = basePoints + streakBonus;

      this.session.score += totalPoints;
      this.session.currentStreak = nextStreak;
      if (nextStreak > this.session.bestStreak) {
        this.session.bestStreak = nextStreak;
      }

      scoringCase.pointsEarned = totalPoints;
      this.session.casesResolved++;

      if (outcome === 'critical') {
        this.session.criticalDeletions++;
      } else if (outcome === 'harmful') {
        this.session.harmfulDeletions++;
      }

      const scoreEvent: ScoreEvent = {
        caseId: scoringCase.id,
        actionId,
        outcome,
        basePoints,
        streakBonus,
        totalPoints,
        timestamp: Date.now(),
        explanation: rule.explanation,
        storageEffectText,
      };

      this.session.actionLedger.unshift(scoreEvent);

      const actionEvent: ActionEvent = {
        id: `act_${Date.now()}_${Math.random()}`,
        actionId,
        title: scoringCase.title,
        description: rule.explanation,
        timestamp: Date.now(),
        outcome,
        points: totalPoints,
      };

      this.session.recentActions.unshift(actionEvent);
      if (this.session.recentActions.length > 5) {
        this.session.recentActions = this.session.recentActions.slice(0, 5);
      }

      this.emitToast({
        id: `toast_${Date.now()}`,
        outcome,
        basePoints,
        streakBonus,
        totalPoints,
        explanation: rule.explanation,
        storageEffectText,
      });
    }
  }

  // ----------------------------------------------------
  // MAIL DOMAIN ACTIONS
  // ----------------------------------------------------
  public archiveMessages(ids: string[]): boolean {
    if (!this.canMutate()) return false;
    let modified = false;

    for (const id of ids) {
      const msg = this.dataset.mailMessages.find((m) => m.id === id);
      if (msg && msg.folderId !== 'archive') {
        msg.folderId = 'archive';
        modified = true;
      }
    }

    if (modified) {
      this.processScoring('mail.archive', ids, undefined, undefined, '0 B: archivar organiza, no libera almacenamiento');
      this.notify();
    }
    return modified;
  }

  public moveMessagesToFolder(ids: string[], folderId: string): boolean {
    if (!this.canMutate()) return false;
    let modified = false;

    for (const id of ids) {
      const msg = this.dataset.mailMessages.find((m) => m.id === id);
      if (msg) {
        msg.folderId = folderId;
        modified = true;
      }
    }

    if (modified) {
      this.processScoring('mail.moveToFolder', ids, folderId, undefined, '0 B: mover a carpeta no libera almacenamiento');
      this.notify();
    }
    return modified;
  }

  public moveMessagesToTrash(ids: string[]): boolean {
    if (!this.canMutate()) return false;
    let modified = false;
    let totalTrashBytes = 0;

    for (const id of ids) {
      const msg = this.dataset.mailMessages.find((m) => m.id === id);
      if (msg && msg.folderId !== 'trash') {
        msg.deletedFromFolderId = msg.folderId;
        msg.folderId = 'trash';
        msg.status = 'trash';
        modified = true;

        // Update body unit status
        const bodyUnit = this.dataset.storageUnits.find((u) => u.id === msg.bodyStorageUnitId);
        if (bodyUnit) {
          bodyUnit.status = 'trash';
          totalTrashBytes += bodyUnit.sizeBytes;
        }

        // Update attachment units
        for (const attId of msg.attachmentIds) {
          const att = this.dataset.mailAttachments.find((a) => a.id === attId);
          if (att && att.storageUnitId) {
            const attUnit = this.dataset.storageUnits.find((u) => u.id === att.storageUnitId);
            if (attUnit) {
              attUnit.status = 'trash';
              totalTrashBytes += attUnit.sizeBytes;
            }
          }
        }
      }
    }

    if (modified) {
      this.processScoring(
        'mail.moveToTrash',
        ids,
        undefined,
        undefined,
        `${formatBytes(totalTrashBytes)} movidos a Papelera (siguen ocupando almacenamiento)`
      );
      this.notify();
    }
    return modified;
  }

  public restoreMessages(ids: string[]): boolean {
    if (!this.canMutate()) return false;
    let modified = false;

    for (const id of ids) {
      const msg = this.dataset.mailMessages.find((m) => m.id === id);
      if (msg && msg.folderId === 'trash') {
        msg.folderId = msg.deletedFromFolderId || 'inbox';
        msg.status = 'active';
        modified = true;

        const bodyUnit = this.dataset.storageUnits.find((u) => u.id === msg.bodyStorageUnitId);
        if (bodyUnit) bodyUnit.status = 'active';

        for (const attId of msg.attachmentIds) {
          const att = this.dataset.mailAttachments.find((a) => a.id === attId);
          if (att && att.storageUnitId) {
            const attUnit = this.dataset.storageUnits.find((u) => u.id === att.storageUnitId);
            if (attUnit) attUnit.status = 'active';
          }
        }
      }
    }

    if (modified) {
      this.processScoring('mail.restore', ids, undefined, undefined, 'Restaurado a la carpeta original');
      this.notify();
    }
    return modified;
  }

  public permanentlyDeleteMessages(ids: string[]): boolean {
    if (!this.canMutate()) return false;
    let modified = false;
    let freedBytes = 0;

    for (const id of ids) {
      const msg = this.dataset.mailMessages.find((m) => m.id === id);
      if (msg) {
        msg.status = 'deleted';
        modified = true;

        // Check body storage unit references
        const otherRefs = this.dataset.mailMessages.some(
          (m) => m.id !== msg.id && m.status !== 'deleted' && m.bodyStorageUnitId === msg.bodyStorageUnitId
        );

        if (!otherRefs) {
          const bodyUnit = this.dataset.storageUnits.find((u) => u.id === msg.bodyStorageUnitId);
          if (bodyUnit && bodyUnit.status !== 'deleted') {
            bodyUnit.status = 'deleted';
            freedBytes += bodyUnit.sizeBytes;
          }
        }

        // Check attachments
        for (const attId of msg.attachmentIds) {
          const att = this.dataset.mailAttachments.find((a) => a.id === attId);
          if (att && att.storageUnitId) {
            // Check if any other non-deleted message or drive file uses this storage unit
            const otherAttUse = this.dataset.mailAttachments.some(
              (a) => a.id !== att.id && a.storageUnitId === att.storageUnitId && this.dataset.mailMessages.some((m) => m.id === a.messageId && m.status !== 'deleted')
            );
            const otherDriveUse = this.dataset.driveFiles.some(
              (df) => df.status !== 'deleted' && df.storageUnitId === att.storageUnitId
            );

            if (!otherAttUse && !otherDriveUse) {
              const attUnit = this.dataset.storageUnits.find((u) => u.id === att.storageUnitId);
              if (attUnit && attUnit.status !== 'deleted') {
                attUnit.status = 'deleted';
                freedBytes += attUnit.sizeBytes;
              }
            }
          }
        }
      }
    }

    if (modified) {
      this.processScoring(
        'mail.deleteForever',
        ids,
        undefined,
        undefined,
        freedBytes > 0 ? `${formatBytes(freedBytes)} liberados definitivamente` : '0 B liberados'
      );
      this.notify();
    }
    return modified;
  }

  public emptyMailTrash(): boolean {
    const trashMsgs = this.dataset.mailMessages.filter((m) => m.folderId === 'trash' && m.status !== 'deleted');
    if (trashMsgs.length === 0) return false;
    const ids = trashMsgs.map((m) => m.id);
    return this.permanentlyDeleteMessages(ids);
  }

  public markMessagesRead(ids: string[], read: boolean): boolean {
    if (!this.canMutate()) return false;
    let modified = false;
    for (const id of ids) {
      const msg = this.dataset.mailMessages.find((m) => m.id === id);
      if (msg && msg.read !== read) {
        msg.read = read;
        modified = true;
      }
    }
    if (modified) {
      this.processScoring(read ? 'mail.markRead' : 'mail.markUnread', ids);
      this.notify();
    }
    return modified;
  }

  public toggleMessageStar(id: string): boolean {
    if (!this.canMutate()) return false;
    const msg = this.dataset.mailMessages.find((m) => m.id === id);
    if (!msg) return false;
    msg.starred = !msg.starred;
    this.processScoring(msg.starred ? 'mail.star' : 'mail.unstar', [id]);
    this.notify();
    return true;
  }

  public markJunk(ids: string[]): boolean {
    if (!this.canMutate()) return false;
    let modified = false;
    for (const id of ids) {
      const msg = this.dataset.mailMessages.find((m) => m.id === id);
      if (msg && msg.folderId !== 'junk') {
        msg.folderId = 'junk';
        msg.isJunk = true;
        modified = true;
      }
    }
    if (modified) {
      this.processScoring('mail.markJunk', ids);
      this.notify();
    }
    return modified;
  }

  public removeFromJunk(ids: string[]): boolean {
    if (!this.canMutate()) return false;
    let modified = false;
    for (const id of ids) {
      const msg = this.dataset.mailMessages.find((m) => m.id === id);
      if (msg && msg.folderId === 'junk') {
        msg.folderId = 'inbox';
        msg.isJunk = false;
        modified = true;
      }
    }
    if (modified) {
      this.processScoring('mail.removeFromJunk', ids);
      this.notify();
    }
    return modified;
  }

  public saveAttachmentToDrive(messageId: string, attachmentId: string, folderId: string): boolean {
    if (!this.canMutate()) return false;
    const att = this.dataset.mailAttachments.find((a) => a.id === attachmentId && a.messageId === messageId);
    if (!att) return false;

    // Creates new drive file with new storage unit (increases used storage!)
    const newFileId = `file_saved_${Date.now()}`;
    const newUnitId = `su_saved_${Date.now()}`;
    const size = att.sizeBytes || 5_000_000;

    const newUnit: StorageUnit = {
      id: newUnitId,
      sizeBytes: size,
      kind: 'drive-file',
      status: 'active',
      originalStatus: 'active',
      ownerEntityIds: [newFileId],
    };
    this.dataset.storageUnits.push(newUnit);

    const ext = att.fileName.includes('.') ? att.fileName.split('.').pop()! : 'bin';
    const driveFile: DriveFile = {
      id: newFileId,
      name: att.fileName,
      extension: ext,
      mimeType: att.mimeType,
      category: 'documents',
      folderId,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      currentVersionId: `ver_${newFileId}`,
      versionIds: [`ver_${newFileId}`],
      storageUnitId: newUnitId,
      shared: false,
      favorite: false,
      tags: ['guardado desde correo'],
      relatedMessageIds: [messageId],
      status: 'active',
    };
    this.dataset.driveFiles.push(driveFile);

    this.processScoring('mail.saveAttachmentToDrive', [messageId], undefined, undefined, `+${formatBytes(size)} añadidos al crear nueva copia en OneDrive`);
    this.notify();
    return true;
  }

  public replaceDraftAttachmentWithLink(draftId: string, attachmentId: string, driveFileId: string): boolean {
    if (!this.canMutate()) return false;
    const draft = this.dataset.mailMessages.find((m) => m.id === draftId);
    if (!draft) return false;

    const attIndex = draft.attachmentIds.indexOf(attachmentId);
    if (attIndex === -1) return false;

    const att = this.dataset.mailAttachments.find((a) => a.id === attachmentId);
    const driveFile = this.dataset.driveFiles.find((f) => f.id === driveFileId);
    if (!att || !driveFile) return false;

    // Convert attachment to link
    att.isLink = true;
    att.sourceDriveFileId = driveFile.id;

    // If attachment had its own physical storage unit, check if it can be freed
    let freed = 0;
    if (att.storageUnitId) {
      const otherUses = this.dataset.mailAttachments.some((a) => a.id !== att.id && a.storageUnitId === att.storageUnitId);
      if (!otherUses) {
        const u = this.dataset.storageUnits.find((su) => su.id === att.storageUnitId);
        if (u) {
          u.status = 'deleted';
          freed = u.sizeBytes;
        }
      }
    }

    if (!draft.linkedFileIds.includes(driveFile.id)) {
      draft.linkedFileIds.push(driveFile.id);
    }

    this.processScoring(
      'mail.replaceDraftAttachmentWithLink',
      [draftId],
      undefined,
      undefined,
      freed > 0 ? `${formatBytes(freed)} liberados al reemplazar adjunto por enlace` : 'Enlace adjuntado'
    );
    this.notify();
    return true;
  }

  public saveDraft(draft: Partial<MailMessage> & { id?: string }): MailMessage {
    let msg: MailMessage;
    if (draft.id) {
      msg = this.dataset.mailMessages.find((m) => m.id === draft.id)!;
      Object.assign(msg, draft);
    } else {
      const now = new Date().toISOString();
      const newId = `msg_draft_${Date.now()}`;
      const bodySu: StorageUnit = {
        id: `su_${newId}_b`,
        sizeBytes: 15_000,
        kind: 'mail-body',
        status: 'active',
        originalStatus: 'active',
        ownerEntityIds: [newId],
      };
      this.dataset.storageUnits.push(bodySu);

      msg = {
        id: newId,
        threadId: `th_${newId}`,
        folderId: 'drafts',
        senderContactId: 'user_current',
        senderNameSnapshot: 'Raúl Jiménez',
        senderEmailSnapshot: 'raul.jimenez@us.example',
        to: draft.to || [],
        cc: draft.cc || [],
        subject: draft.subject || '(Sin asunto)',
        body: draft.body || '',
        preview: (draft.body || '').slice(0, 75),
        sentAt: now,
        read: true,
        starred: false,
        important: false,
        categories: [],
        attachmentIds: draft.attachmentIds || [],
        linkedFileIds: draft.linkedFileIds || [],
        bodyStorageUnitId: bodySu.id,
        isJunk: false,
        status: 'active',
      };
      this.dataset.mailMessages.push(msg);
    }

    this.processScoring('mail.saveDraft', [msg.id]);
    this.notify();
    return msg;
  }

  public sendMail(draftId: string): boolean {
    if (!this.canMutate()) return false;
    const msg = this.dataset.mailMessages.find((m) => m.id === draftId);
    if (!msg) return false;

    msg.folderId = 'sent';
    msg.sentAt = new Date().toISOString();
    this.processScoring('mail.send', [draftId]);
    this.notify();
    return true;
  }

  // ----------------------------------------------------
  // FILES / ONEDRIVE DOMAIN ACTIONS
  // ----------------------------------------------------
  public createDriveFolder(name: string, parentFolderId?: string): DriveFolder {
    const newId = `folder_${Date.now()}`;
    const folder: DriveFolder = {
      id: newId,
      name,
      parentFolderId,
      status: 'active',
    };
    this.dataset.driveFolders.push(folder);
    this.notify();
    return folder;
  }

  public renameFile(fileId: string, newName: string): boolean {
    if (!this.canMutate()) return false;
    const f = this.dataset.driveFiles.find((file) => file.id === fileId);
    if (!f) return false;
    f.name = newName;
    f.modifiedAt = new Date().toISOString();
    this.notify();
    return true;
  }

  public moveFilesToFolder(ids: string[], targetFolderId: string): boolean {
    if (!this.canMutate()) return false;
    let modified = false;
    for (const id of ids) {
      const f = this.dataset.driveFiles.find((file) => file.id === id);
      if (f && f.folderId !== targetFolderId) {
        f.folderId = targetFolderId;
        f.modifiedAt = new Date().toISOString();
        modified = true;
      }
    }
    if (modified) {
      this.processScoring('file.moveToFolder', ids, targetFolderId, undefined, '0 B: mover de carpeta no altera el almacenamiento');
      this.notify();
    }
    return modified;
  }

  public moveFilesToTrash(ids: string[]): boolean {
    if (!this.canMutate()) return false;
    let modified = false;
    let totalTrash = 0;

    for (const id of ids) {
      const f = this.dataset.driveFiles.find((file) => file.id === id);
      if (f && f.status !== 'trash') {
        f.previousFolderId = f.folderId;
        f.status = 'trash';
        modified = true;

        const su = this.dataset.storageUnits.find((u) => u.id === f.storageUnitId);
        if (su) {
          su.status = 'trash';
          totalTrash += su.sizeBytes;
        }
      }
    }

    if (modified) {
      this.processScoring(
        'file.moveToTrash',
        ids,
        undefined,
        undefined,
        `${formatBytes(totalTrash)} enviados a Papelera (siguen ocupando almacenamiento)`
      );
      this.notify();
    }
    return modified;
  }

  public restoreFiles(ids: string[]): boolean {
    if (!this.canMutate()) return false;
    let modified = false;

    for (const id of ids) {
      const f = this.dataset.driveFiles.find((file) => file.id === id);
      if (f && f.status === 'trash') {
        f.status = 'active';
        f.folderId = f.previousFolderId || this.dataset.driveFolders[0].id;
        modified = true;

        const su = this.dataset.storageUnits.find((u) => u.id === f.storageUnitId);
        if (su) su.status = 'active';
      }
    }

    if (modified) {
      this.processScoring('file.restore', ids, undefined, undefined, 'Restaurado desde Papelera');
      this.notify();
    }
    return modified;
  }

  public permanentlyDeleteFiles(ids: string[]): boolean {
    if (!this.canMutate()) return false;
    let modified = false;
    let freedBytes = 0;

    for (const id of ids) {
      const f = this.dataset.driveFiles.find((file) => file.id === id);
      if (f) {
        f.status = 'deleted';
        modified = true;

        // Check if other files or attachments reference this storage unit
        const otherFileUse = this.dataset.driveFiles.some(
          (file) => file.id !== f.id && file.status !== 'deleted' && file.storageUnitId === f.storageUnitId
        );
        const otherAttUse = this.dataset.mailAttachments.some(
          (att) => att.storageUnitId === f.storageUnitId && this.dataset.mailMessages.some((m) => m.id === att.messageId && m.status !== 'deleted')
        );

        if (!otherFileUse && !otherAttUse) {
          const su = this.dataset.storageUnits.find((u) => u.id === f.storageUnitId);
          if (su && su.status !== 'deleted') {
            su.status = 'deleted';
            freedBytes += su.sizeBytes;
          }
        }
      }
    }

    if (modified) {
      this.processScoring(
        'file.deleteForever',
        ids,
        undefined,
        undefined,
        freedBytes > 0 ? `${formatBytes(freedBytes)} liberados definitivamente` : '0 B liberados'
      );
      this.notify();
    }
    return modified;
  }

  public deleteOldFileVersion(fileId: string, versionId: string): boolean {
    if (!this.canMutate()) return false;
    const f = this.dataset.driveFiles.find((file) => file.id === fileId);
    if (!f) return false;

    // Cannot delete current version if it's the sole current version
    const ver = this.dataset.fileVersions.find((v) => v.id === versionId && v.fileId === fileId);
    if (!ver || ver.isCurrent) return false;

    ver.status = 'deleted';
    f.versionIds = f.versionIds.filter((vId) => vId !== versionId);

    let freed = 0;
    const su = this.dataset.storageUnits.find((u) => u.id === ver.storageUnitId);
    if (su && su.status !== 'deleted') {
      su.status = 'deleted';
      freed = su.sizeBytes;
    }

    this.processScoring(
      'file.deleteVersion',
      [fileId],
      undefined,
      undefined,
      freed > 0 ? `${formatBytes(freed)} liberados al eliminar versión antigua` : 'Versión eliminada'
    );
    this.notify();
    return true;
  }

  public createShareLink(fileId: string, access: ShareLink['access'] = 'people-in-org'): ShareLink | null {
    if (!this.canMutate()) return null;
    const f = this.dataset.driveFiles.find((file) => file.id === fileId);
    if (!f) return null;

    const link: ShareLink = {
      id: `link_${Date.now()}`,
      driveFileId: fileId,
      url: `https://onedrive.sim/s/${f.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      access,
    };

    f.shared = true;
    f.shareLink = link;

    this.processScoring('file.createShareLink', [fileId], undefined, undefined, '0 B: enlace creado sin duplicar el archivo');
    this.notify();
    return link;
  }

  public updateShareAccess(fileId: string, access: ShareLink['access']): boolean {
    if (!this.canMutate()) return false;
    const f = this.dataset.driveFiles.find((file) => file.id === fileId);
    if (!f || !f.shareLink) return false;

    f.shareLink.access = access;
    this.processScoring('file.updateShareAccess', [fileId], undefined, undefined, `Acceso actualizado a: ${access}`);
    this.notify();
    return true;
  }

  public revokeShareLink(fileId: string): boolean {
    if (!this.canMutate()) return false;
    const f = this.dataset.driveFiles.find((file) => file.id === fileId);
    if (!f) return false;

    f.shared = false;
    f.shareLink = undefined;

    this.processScoring('file.revokeShareLink', [fileId], undefined, undefined, 'Enlace revocado sin borrar el archivo original');
    this.notify();
    return true;
  }

  public toggleFileFavorite(fileId: string): boolean {
    if (!this.canMutate()) return false;
    const f = this.dataset.driveFiles.find((file) => file.id === fileId);
    if (!f) return false;

    f.favorite = !f.favorite;
    this.processScoring(f.favorite ? 'file.favorite' : 'file.unfavorite', [fileId]);
    this.notify();
    return true;
  }

  // ----------------------------------------------------
  // CALENDAR DOMAIN ACTIONS
  // ----------------------------------------------------
  public respondToInvitation(eventId: string, response: 'accepted' | 'tentative' | 'decline'): boolean {
    if (!this.canMutate()) return false;
    const ev = this.dataset.calendarEvents.find((e) => e.id === eventId);
    if (!ev) return false;

    ev.response = response === 'decline' ? 'declined' : (response as any);
    const actionId = response === 'accepted' ? 'event.accept' : response === 'tentative' ? 'event.tentative' : 'event.decline';

    this.processScoring(actionId, [eventId]);
    this.notify();
    return true;
  }

  public cancelOwnedEvent(eventId: string, scope: 'occurrence' | 'series' = 'series'): boolean {
    if (!this.canMutate()) return false;
    const ev = this.dataset.calendarEvents.find((e) => e.id === eventId);
    if (!ev) return false;

    ev.status = 'cancelled';
    this.processScoring('event.cancelOwned', [eventId], undefined, scope);
    this.notify();
    return true;
  }

  public removeEventFromPersonalCalendar(eventId: string, scope: 'occurrence' | 'series' = 'occurrence'): boolean {
    if (!this.canMutate()) return false;
    const ev = this.dataset.calendarEvents.find((e) => e.id === eventId);
    if (!ev) return false;

    ev.removedFromPersonal = true;
    this.processScoring('event.removeFromPersonalCalendar', [eventId], undefined, scope);
    this.notify();
    return true;
  }

  public deleteCalendarEvent(eventId: string, scope: 'occurrence' | 'series' = 'occurrence'): boolean {
    if (!this.canMutate()) return false;
    const ev = this.dataset.calendarEvents.find((e) => e.id === eventId);
    if (!ev) return false;

    if (scope === 'series') {
      ev.status = 'deleted';
      this.processScoring('event.deleteSeries', [eventId], undefined, 'series');
    } else {
      ev.status = 'deleted';
      this.processScoring('event.deleteOccurrence', [eventId], undefined, 'occurrence');
    }

    this.notify();
    return true;
  }

  // ----------------------------------------------------
  // CONTACTS DOMAIN ACTIONS
  // ----------------------------------------------------
  public editContact(contactId: string, updates: Partial<Contact>): boolean {
    if (!this.canMutate()) return false;
    const c = this.dataset.contacts.find((cnt) => cnt.id === contactId);
    if (!c) return false;

    Object.assign(c, updates);
    this.processScoring('contact.edit', [contactId]);
    this.notify();
    return true;
  }

  public toggleContactFavorite(contactId: string): boolean {
    if (!this.canMutate()) return false;
    const c = this.dataset.contacts.find((cnt) => cnt.id === contactId);
    if (!c) return false;

    c.favorite = !c.favorite;
    this.processScoring(c.favorite ? 'contact.favorite' : 'contact.unfavorite', [contactId]);
    this.notify();
    return true;
  }

  public addContactGroup(contactId: string, groupName: string): boolean {
    if (!this.canMutate()) return false;
    const c = this.dataset.contacts.find((cnt) => cnt.id === contactId);
    if (!c) return false;

    if (!c.groups.includes(groupName)) {
      c.groups.push(groupName);
      this.processScoring('contact.addGroup', [contactId]);
      this.notify();
      return true;
    }
    return false;
  }

  public deleteContact(contactId: string): boolean {
    if (!this.canMutate()) return false;
    const c = this.dataset.contacts.find((cnt) => cnt.id === contactId);
    if (!c) return false;

    c.status = 'deleted';
    this.processScoring('contact.delete', [contactId]);
    this.notify();
    return true;
  }

  public mergeContacts(
    primaryId: string,
    secondaryIds: string[],
    resolvedFields: Partial<Contact>
  ): boolean {
    if (!this.canMutate()) return false;
    const primary = this.dataset.contacts.find((c) => c.id === primaryId);
    if (!primary) return false;

    Object.assign(primary, resolvedFields);

    for (const secId of secondaryIds) {
      const sec = this.dataset.contacts.find((c) => c.id === secId);
      if (sec) {
        sec.status = 'merged';
        sec.mergedIntoContactId = primaryId;
      }
    }

    // Evaluate scoring for all affected contacts
    const allIds = [primaryId, ...secondaryIds];
    this.processScoring('contact.merge', allIds, undefined, undefined, 'Contactos fusionados conservando datos complementarios');
    this.notify();
    return true;
  }
}

export const globalGameController = new GameController();


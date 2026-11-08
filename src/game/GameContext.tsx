import React, { createContext, useContext, useEffect, useState } from 'react';
import { FeedbackToast, GameController, globalGameController } from './gameController';
import {
  BadgeInfo,
  CalendarEvent,
  Contact,
  DatasetState,
  DriveFile,
  DriveFolder,
  GameSession,
  MailMessage,
  RankingEntry,
  ShareLink,
  StorageMetrics,
} from '../domain/types';

interface ConfirmDialogConfig {
  title: string;
  message: string;
  details?: string[];
  warningNotice?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
}

interface GameContextValue {
  session: GameSession;
  dataset: DatasetState;
  storage: StorageMetrics;
  badge: BadgeInfo;
  remainingMs: number;
  ranking: RankingEntry[];
  toasts: FeedbackToast[];
  confirmDialog: ConfirmDialogConfig | null;
  activeModule: 'mail' | 'files' | 'calendar' | 'contacts';
  setActiveModule: (module: 'mail' | 'files' | 'calendar' | 'contacts') => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  showConfirmDialog: (config: ConfirmDialogConfig) => void;
  closeConfirmDialog: () => void;

  // Actions
  startNewGame: (alias?: string) => void;
  finishGame: (reason?: 'timeout' | 'voluntary') => void;
  resetGame: () => Promise<void>;
  clearRanking: () => void;

  // Mail
  archiveMessages: (ids: string[]) => boolean;
  moveMessagesToFolder: (ids: string[], folderId: string) => boolean;
  moveMessagesToTrash: (ids: string[]) => boolean;
  restoreMessages: (ids: string[]) => boolean;
  permanentlyDeleteMessages: (ids: string[]) => boolean;
  emptyMailTrash: () => boolean;
  markMessagesRead: (ids: string[], read: boolean) => boolean;
  toggleMessageStar: (id: string) => boolean;
  markJunk: (ids: string[]) => boolean;
  removeFromJunk: (ids: string[]) => boolean;
  saveAttachmentToDrive: (messageId: string, attachmentId: string, folderId: string) => boolean;
  replaceDraftAttachmentWithLink: (draftId: string, attachmentId: string, driveFileId: string) => boolean;
  saveDraft: (draft: Partial<MailMessage> & { id?: string }) => MailMessage;
  sendMail: (draftId: string) => boolean;

  // Files
  createDriveFolder: (name: string, parentFolderId?: string) => DriveFolder;
  renameFile: (fileId: string, newName: string) => boolean;
  moveFilesToFolder: (ids: string[], targetFolderId: string) => boolean;
  moveFilesToTrash: (ids: string[]) => boolean;
  restoreFiles: (ids: string[]) => boolean;
  permanentlyDeleteFiles: (ids: string[]) => boolean;
  deleteOldFileVersion: (fileId: string, versionId: string) => boolean;
  createShareLink: (fileId: string, access?: ShareLink['access']) => ShareLink | null;
  updateShareAccess: (fileId: string, access: ShareLink['access']) => boolean;
  revokeShareLink: (fileId: string) => boolean;
  toggleFileFavorite: (fileId: string) => boolean;

  // Calendar
  respondToInvitation: (eventId: string, response: 'accepted' | 'tentative' | 'decline') => boolean;
  cancelOwnedEvent: (eventId: string, scope?: 'occurrence' | 'series') => boolean;
  removeEventFromPersonalCalendar: (eventId: string, scope?: 'occurrence' | 'series') => boolean;
  deleteCalendarEvent: (eventId: string, scope?: 'occurrence' | 'series') => boolean;

  // Contacts
  editContact: (contactId: string, updates: Partial<Contact>) => boolean;
  toggleContactFavorite: (contactId: string) => boolean;
  addContactGroup: (contactId: string, groupName: string) => boolean;
  deleteContact: (contactId: string) => boolean;
  mergeContacts: (primaryId: string, secondaryIds: string[], resolvedFields: Partial<Contact>) => boolean;
}

const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [controller] = useState<GameController>(globalGameController);
  const [session, setSession] = useState<GameSession>(controller.getSession());
  const [dataset, setDataset] = useState<DatasetState>(controller.getDataset());
  const [storage, setStorage] = useState<StorageMetrics>(controller.getStorageMetrics());
  const [remainingMs, setRemainingMs] = useState<number>(controller.getRemainingMs());
  const [ranking, setRanking] = useState<RankingEntry[]>(controller.getRanking());
  const [toasts, setToasts] = useState<FeedbackToast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogConfig | null>(null);
  const [activeModule, setActiveModule] = useState<'mail' | 'files' | 'calendar' | 'contacts'>('mail');
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  useEffect(() => {
    controller.init();

    const unsubscribe = controller.subscribe(() => {
      setSession({ ...controller.getSession() });
      setDataset({ ...controller.getDataset() });
      setStorage(controller.getStorageMetrics());
      setRemainingMs(controller.getRemainingMs());
      setRanking(controller.getRanking());
    });

    const unsubscribeToasts = controller.subscribeToasts((toast) => {
      setToasts((prev) => [toast, ...prev].slice(0, 4));
      // Auto dismiss after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3500);
    });

    return () => {
      unsubscribe();
      unsubscribeToasts();
    };
  }, [controller]);

  // Robust timer tick updating remaining time from absolute deadline
  useEffect(() => {
    if (session.status !== 'active') return;

    const timer = setInterval(() => {
      const rem = controller.getRemainingMs();
      setRemainingMs(rem);
      if (rem <= 0) {
        clearInterval(timer);
      }
    }, 250);

    return () => clearInterval(timer);
  }, [controller, session.status]);

  const showConfirmDialog = (config: ConfirmDialogConfig) => setConfirmDialog(config);
  const closeConfirmDialog = () => setConfirmDialog(null);

  const value: GameContextValue = {
    session,
    dataset,
    storage,
    badge: controller.getBadge(),
    remainingMs,
    ranking,
    toasts,
    confirmDialog,
    activeModule,
    setActiveModule,
    globalSearchQuery,
    setGlobalSearchQuery,
    showConfirmDialog,
    closeConfirmDialog,

    startNewGame: (alias?: string) => controller.startNewGame(alias),
    finishGame: (reason?: 'timeout' | 'voluntary') => controller.finishGame(reason || 'voluntary'),
    resetGame: () => controller.resetGame(),
    clearRanking: () => controller.clearRanking(),

    // Mail
    archiveMessages: (ids) => controller.archiveMessages(ids),
    moveMessagesToFolder: (ids, folderId) => controller.moveMessagesToFolder(ids, folderId),
    moveMessagesToTrash: (ids) => controller.moveMessagesToTrash(ids),
    restoreMessages: (ids) => controller.restoreMessages(ids),
    permanentlyDeleteMessages: (ids) => controller.permanentlyDeleteMessages(ids),
    emptyMailTrash: () => controller.emptyMailTrash(),
    markMessagesRead: (ids, read) => controller.markMessagesRead(ids, read),
    toggleMessageStar: (id) => controller.toggleMessageStar(id),
    markJunk: (ids) => controller.markJunk(ids),
    removeFromJunk: (ids) => controller.removeFromJunk(ids),
    saveAttachmentToDrive: (mId, aId, fId) => controller.saveAttachmentToDrive(mId, aId, fId),
    replaceDraftAttachmentWithLink: (dId, aId, dfId) => controller.replaceDraftAttachmentWithLink(dId, aId, dfId),
    saveDraft: (draft) => controller.saveDraft(draft),
    sendMail: (draftId) => controller.sendMail(draftId),

    // Files
    createDriveFolder: (name, pId) => controller.createDriveFolder(name, pId),
    renameFile: (id, name) => controller.renameFile(id, name),
    moveFilesToFolder: (ids, fId) => controller.moveFilesToFolder(ids, fId),
    moveFilesToTrash: (ids) => controller.moveFilesToTrash(ids),
    restoreFiles: (ids) => controller.restoreFiles(ids),
    permanentlyDeleteFiles: (ids) => controller.permanentlyDeleteFiles(ids),
    deleteOldFileVersion: (fId, vId) => controller.deleteOldFileVersion(fId, vId),
    createShareLink: (fId, access) => controller.createShareLink(fId, access),
    updateShareAccess: (fId, access) => controller.updateShareAccess(fId, access),
    revokeShareLink: (fId) => controller.revokeShareLink(fId),
    toggleFileFavorite: (fId) => controller.toggleFileFavorite(fId),

    // Calendar
    respondToInvitation: (eId, res) => controller.respondToInvitation(eId, res),
    cancelOwnedEvent: (eId, scope) => controller.cancelOwnedEvent(eId, scope),
    removeEventFromPersonalCalendar: (eId, scope) => controller.removeEventFromPersonalCalendar(eId, scope),
    deleteCalendarEvent: (eId, scope) => controller.deleteCalendarEvent(eId, scope),

    // Contacts
    editContact: (cId, up) => controller.editContact(cId, up),
    toggleContactFavorite: (cId) => controller.toggleContactFavorite(cId),
    addContactGroup: (cId, g) => controller.addContactGroup(cId, g),
    deleteContact: (cId) => controller.deleteContact(cId),
    mergeContacts: (pId, sIds, rf) => controller.mergeContacts(pId, sIds, rf),
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}


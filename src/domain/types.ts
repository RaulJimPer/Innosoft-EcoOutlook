export type GameStatus = 'welcome' | 'active' | 'results';

export interface MailFolder {
  id: string;
  name: string;
  type: 'system' | 'custom';
  parentFolderId?: string;
  systemRole?: 'inbox' | 'sent' | 'drafts' | 'archive' | 'junk' | 'trash';
}

export interface Recipient {
  contactId?: string;
  displayName: string;
  email: string;
}

export interface MailAttachment {
  id: string;
  messageId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storageUnitId?: string; // present if physical copy
  sourceDriveFileId?: string;
  isLink: boolean;
}

export interface MailMessage {
  id: string;
  threadId: string;
  folderId: string;
  senderContactId?: string;
  senderNameSnapshot: string;
  senderEmailSnapshot: string;
  to: Recipient[];
  cc: Recipient[];
  subject: string;
  body: string;
  preview: string;
  sentAt: string; // ISO 8601
  receivedAt?: string;
  read: boolean;
  starred: boolean;
  important: boolean;
  categories: string[];
  attachmentIds: string[];
  linkedFileIds: string[];
  bodyStorageUnitId: string;
  deletedFromFolderId?: string;
  isJunk: boolean;
  scoringCaseId?: string;
  status: 'active' | 'trash' | 'deleted';
}

export type FileCategory =
  | 'documents'
  | 'images'
  | 'videos'
  | 'audio'
  | 'sheets'
  | 'compressed'
  | 'other';

export interface ShareLink {
  id: string;
  driveFileId: string;
  url: string;
  createdAt: string;
  access: 'people-in-org' | 'anyone-with-link' | 'specific-people';
}

export interface DriveFolder {
  id: string;
  name: string;
  parentFolderId?: string;
  status: 'active' | 'trash';
}

export interface FileVersion {
  id: string;
  fileId: string;
  versionNumber: number;
  modifiedAt: string;
  storageUnitId: string;
  isCurrent: boolean;
  note?: string;
  status: 'active' | 'deleted';
}

export interface DriveFile {
  id: string;
  name: string;
  extension: string;
  mimeType: string;
  category: FileCategory;
  folderId: string;
  ownerContactId?: string;
  createdAt: string;
  modifiedAt: string;
  currentVersionId: string;
  versionIds: string[];
  storageUnitId: string;
  shared: boolean;
  shareLink?: ShareLink;
  favorite: boolean;
  tags: string[];
  duplicateGroupId?: string;
  isCanonicalDuplicate?: boolean;
  relatedMessageIds: string[];
  scoringCaseId?: string;
  status: 'active' | 'trash' | 'deleted';
  previousFolderId?: string;
  descriptionPreview?: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  secondaryEmails: string[];
  phone?: string;
  organization?: string;
  role?: string;
  department?: string;
  groups: string[];
  favorite: boolean;
  notes?: string;
  status: 'active' | 'merged' | 'deleted';
  mergedIntoContactId?: string;
  scoringCaseId?: string;
}

export interface CalendarEvent {
  id: string;
  seriesId?: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  location?: string;
  organizerContactId: string;
  attendeeContactIds: string[];
  currentUserRole: 'organizer' | 'attendee';
  response: 'accepted' | 'tentative' | 'declined' | 'none';
  status: 'confirmed' | 'cancelled' | 'deleted';
  recurrence?: { frequency: 'weekly' | 'monthly'; count: number };
  linkedFileIds: string[];
  scoringCaseId?: string;
  removedFromPersonal?: boolean;
}

export type StorageUnitKind =
  | 'mail-body'
  | 'mail-attachment'
  | 'drive-file'
  | 'file-version'
  | 'other';

export interface StorageUnit {
  id: string;
  sizeBytes: number;
  kind: StorageUnitKind;
  status: 'active' | 'trash' | 'deleted';
  ownerEntityIds: string[];
  originalStatus: 'active' | 'trash';
}

export type ScoreOutcome =
  | 'optimal'
  | 'good'
  | 'partial'
  | 'neutral'
  | 'harmful'
  | 'critical'
  | 'no_score';

export interface ScoringRule {
  actionId: string;
  targetEntityIds?: string[];
  targetEntityRole?:
    | 'canonical'
    | 'redundant'
    | 'important'
    | 'obsolete'
    | 'active'
    | 'duplicate'
    | 'historical'
    | 'unknown';
  targetFolderId?: string;
  outcome: ScoreOutcome;
  explanation: string;
}

export interface ScoringCase {
  id: string;
  module: 'mail' | 'files' | 'calendar' | 'contacts';
  entityIds: string[];
  entityRoles: Record<string, string>;
  title: string;
  context: string;
  learningPoint: string;
  decisionRules: ScoringRule[];
  status: 'pending' | 'resolved';
  resolutionAction?: string;
  resolutionAt?: string;
  outcome?: ScoreOutcome;
  pointsEarned?: number;
}

export interface ScoreEvent {
  caseId: string;
  actionId: string;
  outcome: ScoreOutcome;
  basePoints: number;
  streakBonus: number;
  totalPoints: number;
  timestamp: number;
  explanation: string;
  storageEffectText?: string;
}

export interface ActionEvent {
  id: string;
  actionId: string;
  title: string;
  description: string;
  timestamp: number;
  outcome?: ScoreOutcome;
  points?: number;
  storageDelta?: number;
}

export interface StorageMetrics {
  capacityBytes: number;
  usedBytes: number;
  trashBytes: number;
  freeBytes: number;
  freedBytes: number;
  netDeltaBytes: number;
  activeBytes: number;
}

export type BadgeType =
  | 'exemplary'
  | 'responsible'
  | 'on_track'
  | 'needs_review';

export interface BadgeInfo {
  type: BadgeType;
  title: string;
  description: string;
  color: string;
}

export interface RankingEntry {
  id: string;
  alias: string;
  score: number;
  casesResolved: number;
  criticalDeletions: number;
  freedBytes: number;
  badge: BadgeType;
  playedAt: number;
}

export interface GameSession {
  id: string;
  status: GameStatus;
  startedAt?: number;
  deadlineAt?: number;
  finishedAt?: number;
  alias?: string;
  score: number;
  currentStreak: number;
  bestStreak: number;
  casesResolved: number;
  criticalDeletions: number;
  harmfulDeletions: number;
  actionLedger: ScoreEvent[];
  recentActions: ActionEvent[];
}

export interface DatasetState {
  mailFolders: MailFolder[];
  mailMessages: MailMessage[];
  mailAttachments: MailAttachment[];
  driveFolders: DriveFolder[];
  driveFiles: DriveFile[];
  fileVersions: FileVersion[];
  contacts: Contact[];
  calendarEvents: CalendarEvent[];
  storageUnits: StorageUnit[];
  scoringCases: ScoringCase[];
}


import { MailAttachment, MailMessage } from './types';

export interface MailSearchQuery {
  raw: string;
  from?: string;
  to?: string;
  subject?: string;
  hasAttachment?: boolean;
  filename?: string;
  isUnread?: boolean;
  isRead?: boolean;
  isStarred?: boolean;
  largerThanBytes?: number;
  smallerThanBytes?: number;
  beforeDate?: string;
  afterDate?: string;
  inFolder?: string;
  negativeWords: string[];
  freeWords: string[];
}

export interface ParseResult {
  query?: MailSearchQuery;
  error?: string;
}

function parseSize(sizeStr: string): number | null {
  const match = sizeStr.trim().match(/^(\d+(?:\.\d+)?)\s*([kKmMgGtT]?[bB]?)$/);
  if (!match) return null;
  const num = parseFloat(match[1]);
  const unit = match[2].toUpperCase();

  if (unit.startsWith('K')) return num * 1000;
  if (unit.startsWith('M')) return num * 1_000_000;
  if (unit.startsWith('G')) return num * 1_000_000_000;
  if (unit.startsWith('T')) return num * 1_000_000_000_000;
  return num;
}

function isValidIsoDate(dateStr: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr) && !isNaN(Date.parse(dateStr));
}

export function parseMailSearch(raw: string): ParseResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      query: {
        raw: '',
        negativeWords: [],
        freeWords: [],
      },
    };
  }

  // Tokenize preserving quoted strings
  const tokenRegex = /(?:[^\s"]+|"[^"]*")+/g;
  const tokens = trimmed.match(tokenRegex) || [];

  const query: MailSearchQuery = {
    raw: trimmed,
    negativeWords: [],
    freeWords: [],
  };

  for (const rawToken of tokens) {
    const token = rawToken.replace(/^"|"$/g, '');

    if (token.startsWith('from:')) {
      const val = token.slice(5).trim();
      if (!val) return { error: 'Operador from: requiere un valor' };
      query.from = val.toLowerCase();
    } else if (token.startsWith('to:')) {
      const val = token.slice(3).trim();
      if (!val) return { error: 'Operador to: requiere un valor' };
      query.to = val.toLowerCase();
    } else if (token.startsWith('subject:')) {
      const val = token.slice(8).trim();
      if (!val) return { error: 'Operador subject: requiere un valor' };
      query.subject = val.toLowerCase();
    } else if (token === 'has:attachment') {
      query.hasAttachment = true;
    } else if (token.startsWith('filename:')) {
      const val = token.slice(9).trim();
      if (!val) return { error: 'Operador filename: requiere un nombre o extensión' };
      query.filename = val.toLowerCase();
    } else if (token === 'is:unread') {
      query.isUnread = true;
    } else if (token === 'is:read') {
      query.isRead = true;
    } else if (token === 'is:starred') {
      query.isStarred = true;
    } else if (token.startsWith('larger:')) {
      const val = token.slice(7).trim();
      const bytes = parseSize(val);
      if (bytes === null) {
        return { error: `Tamaño no válido en larger: "${val}". Usa formatos como 500k, 10M, 1G` };
      }
      query.largerThanBytes = bytes;
    } else if (token.startsWith('smaller:')) {
      const val = token.slice(8).trim();
      const bytes = parseSize(val);
      if (bytes === null) {
        return { error: `Tamaño no válido en smaller: "${val}". Usa formatos como 500k, 10M, 1G` };
      }
      query.smallerThanBytes = bytes;
    } else if (token.startsWith('before:')) {
      const val = token.slice(7).trim();
      if (!isValidIsoDate(val)) {
        return { error: `Fecha no válida en before: "${val}". Formato esperado: YYYY-MM-DD` };
      }
      query.beforeDate = val;
    } else if (token.startsWith('after:')) {
      const val = token.slice(6).trim();
      if (!isValidIsoDate(val)) {
        return { error: `Fecha no válida en after: "${val}". Formato esperado: YYYY-MM-DD` };
      }
      query.afterDate = val;
    } else if (token.startsWith('in:')) {
      const val = token.slice(3).trim().toLowerCase();
      const allowed = ['inbox', 'sent', 'archive', 'trash', 'junk', 'drafts'];
      if (!allowed.includes(val)) {
        return { error: `Carpeta no reconocida en in: "${val}". Válidas: ${allowed.join(', ')}` };
      }
      query.inFolder = val;
    } else if (token.startsWith('-') && token.length > 1) {
      query.negativeWords.push(token.slice(1).toLowerCase());
    } else {
      query.freeWords.push(token.toLowerCase());
    }
  }

  return { query };
}

export function filterMessages(
  messages: MailMessage[],
  attachments: MailAttachment[],
  query: MailSearchQuery,
  currentFolderRole?: string
): MailMessage[] {
  const attachmentMap = new Map<string, MailAttachment>();
  for (const att of attachments) {
    attachmentMap.set(att.id, att);
  }

  return messages.filter((msg) => {
    // Check inFolder or currentFolderRole
    if (query.inFolder) {
      // Map inFolder to message folder / systemRole check
      const expected = query.inFolder;
      const isMatch =
        (expected === 'inbox' && msg.folderId === 'inbox') ||
        (expected === 'sent' && msg.folderId === 'sent') ||
        (expected === 'drafts' && msg.folderId === 'drafts') ||
        (expected === 'archive' && (msg.folderId === 'archive' || msg.folderId.startsWith('archive_'))) ||
        (expected === 'trash' && msg.folderId === 'trash') ||
        (expected === 'junk' && msg.folderId === 'junk');
      if (!isMatch) return false;
    }

    if (query.from) {
      const senderText = `${msg.senderNameSnapshot} ${msg.senderEmailSnapshot}`.toLowerCase();
      if (!senderText.includes(query.from)) return false;
    }

    if (query.to) {
      const toText = msg.to.map((r) => `${r.displayName} ${r.email}`).join(' ').toLowerCase();
      const ccText = msg.cc.map((r) => `${r.displayName} ${r.email}`).join(' ').toLowerCase();
      if (!toText.includes(query.to) && !ccText.includes(query.to)) return false;
    }

    if (query.subject) {
      if (!msg.subject.toLowerCase().includes(query.subject)) return false;
    }

    if (query.hasAttachment !== undefined) {
      const has = msg.attachmentIds.length > 0;
      if (has !== query.hasAttachment) return false;
    }

    if (query.filename) {
      const msgAtts = msg.attachmentIds.map((id) => attachmentMap.get(id)).filter(Boolean) as MailAttachment[];
      const matched = msgAtts.some((att) => att.fileName.toLowerCase().includes(query.filename!));
      if (!matched) return false;
    }

    if (query.isUnread !== undefined && query.isUnread) {
      if (msg.read) return false;
    }

    if (query.isRead !== undefined && query.isRead) {
      if (!msg.read) return false;
    }

    if (query.isStarred !== undefined && query.isStarred) {
      if (!msg.starred) return false;
    }

    // Size check
    if (query.largerThanBytes !== undefined || query.smallerThanBytes !== undefined) {
      const msgAtts = msg.attachmentIds.map((id) => attachmentMap.get(id)).filter(Boolean) as MailAttachment[];
      const totalSizeBytes = msgAtts.reduce((acc, a) => acc + (a.sizeBytes || 0), 10_000); // 10 kB base body
      if (query.largerThanBytes !== undefined && totalSizeBytes < query.largerThanBytes) return false;
      if (query.smallerThanBytes !== undefined && totalSizeBytes > query.smallerThanBytes) return false;
    }

    // Date check (YYYY-MM-DD)
    const msgDate = msg.sentAt.slice(0, 10);
    if (query.beforeDate && msgDate >= query.beforeDate) return false;
    if (query.afterDate && msgDate <= query.afterDate) return false;

    // Negative words
    if (query.negativeWords.length > 0) {
      const fullText = `${msg.subject} ${msg.body} ${msg.senderNameSnapshot} ${msg.senderEmailSnapshot}`.toLowerCase();
      for (const neg of query.negativeWords) {
        if (fullText.includes(neg)) return false;
      }
    }

    // Free words
    if (query.freeWords.length > 0) {
      const fullText = `${msg.subject} ${msg.body} ${msg.senderNameSnapshot} ${msg.senderEmailSnapshot}`.toLowerCase();
      for (const word of query.freeWords) {
        if (!fullText.includes(word)) return false;
      }
    }

    return true;
  });
}


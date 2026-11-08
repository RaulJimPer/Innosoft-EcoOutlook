import { DatasetState, GameSession, RankingEntry } from '../../domain/types';
import { getInitialDataset } from '../seed/initialDataset';

const DB_NAME = 'EcoOutlookDB';
const DB_VERSION = 1;
const STORE_DATASET = 'dataset';
const STORE_SESSION = 'session';
const RANKING_KEY = 'eco_outlook_top10_ranking';
const PREFS_KEY = 'eco_outlook_ui_prefs';

let memoryDataset: DatasetState | null = null;
let memorySession: GameSession | null = null;
let memoryRanking: RankingEntry[] = [];

function openDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_DATASET)) {
          db.createObjectStore(STORE_DATASET);
        }
        if (!db.objectStoreNames.contains(STORE_SESSION)) {
          db.createObjectStore(STORE_SESSION);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function loadPersistedState(): Promise<{
  dataset: DatasetState;
  session: GameSession | null;
}> {
  const db = await openDB();

  if (!db) {
    if (!memoryDataset) memoryDataset = getInitialDataset();
    return { dataset: memoryDataset, session: memorySession };
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction([STORE_DATASET, STORE_SESSION], 'readonly');
      const dsReq = tx.objectStore(STORE_DATASET).get('current');
      const sessReq = tx.objectStore(STORE_SESSION).get('current');

      tx.oncomplete = () => {
        const dataset: DatasetState = dsReq.result || getInitialDataset();
        const session: GameSession | null = sessReq.result || null;
        resolve({ dataset, session });
      };

      tx.onerror = () => {
        resolve({ dataset: getInitialDataset(), session: null });
      };
    } catch {
      resolve({ dataset: getInitialDataset(), session: null });
    }
  });
}

export async function savePersistedState(dataset: DatasetState, session: GameSession): Promise<void> {
  memoryDataset = dataset;
  memorySession = session;

  const db = await openDB();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction([STORE_DATASET, STORE_SESSION], 'readwrite');
      tx.objectStore(STORE_DATASET).put(dataset, 'current');
      tx.objectStore(STORE_SESSION).put(session, 'current');
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function resetPersistedDataset(): Promise<DatasetState> {
  const fresh = getInitialDataset();
  memoryDataset = fresh;

  const db = await openDB();
  if (!db) return fresh;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction([STORE_DATASET, STORE_SESSION], 'readwrite');
      tx.objectStore(STORE_DATASET).put(fresh, 'current');
      tx.objectStore(STORE_SESSION).delete('current');
      tx.oncomplete = () => resolve(fresh);
      tx.onerror = () => resolve(fresh);
    } catch {
      resolve(fresh);
    }
  });
}

// -----------------------------------------------------------------------
// Ranking Storage (localStorage)
// -----------------------------------------------------------------------
export function loadRanking(): RankingEntry[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [...memoryRanking];
  }
  try {
    const raw = window.localStorage.getItem(RANKING_KEY);
    if (!raw) return [...memoryRanking];
    const list = JSON.parse(raw);
    if (Array.isArray(list)) return list;
    return [...memoryRanking];
  } catch {
    return [...memoryRanking];
  }
}

export function saveRankingEntry(entry: RankingEntry): RankingEntry[] {
  const list = loadRanking();
  list.push(entry);

  // Sort: score desc, then casesResolved desc, then criticalDeletions asc
  list.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.casesResolved !== a.casesResolved) return b.casesResolved - a.casesResolved;
    return a.criticalDeletions - b.criticalDeletions;
  });

  const top10 = list.slice(0, 10);
  memoryRanking = top10;

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(RANKING_KEY, JSON.stringify(top10));
    } catch {
      // Ignore storage quota errors
    }
  }
  return top10;
}

export function clearRanking(): void {
  memoryRanking = [];
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(RANKING_KEY);
    } catch {
      // Ignore
    }
  }
}

// UI Preferences (view modes, collapsed sidebar, etc.)
export function loadUIPrefs(): Record<string, any> {
  if (typeof window === 'undefined' || !window.localStorage) return {};
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveUIPrefs(prefs: Record<string, any>): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore
  }
}

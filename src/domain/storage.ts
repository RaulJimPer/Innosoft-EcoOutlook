import { StorageMetrics, StorageUnit } from './types';

export const TOTAL_CAPACITY_BYTES = 50_000_000_000; // 50 GB decimal
export const INITIAL_USED_BYTES = 34_000_000_000;   // 34 GB decimal (68%)
export const INITIAL_FREE_BYTES = 16_000_000_000;   // 16 GB decimal

/**
 * Calculates storage metrics according to domain rules:
 * - usedBytes = sum of units with status 'active' or 'trash'
 * - trashBytes = sum of units with status 'trash'
 * - activeBytes = sum of units with status 'active'
 * - freeBytes = capacity - usedBytes
 * - freedBytes = max(0, initial - usedBytes)
 * - netDeltaBytes = initial - usedBytes
 */
export function calculateStorageMetrics(
  units: StorageUnit[],
  capacity: number = TOTAL_CAPACITY_BYTES,
  initialUsed: number = INITIAL_USED_BYTES
): StorageMetrics {
  let usedBytes = 0;
  let trashBytes = 0;
  let activeBytes = 0;

  for (const unit of units) {
    if (unit.status === 'active') {
      activeBytes += unit.sizeBytes;
      usedBytes += unit.sizeBytes;
    } else if (unit.status === 'trash') {
      trashBytes += unit.sizeBytes;
      usedBytes += unit.sizeBytes;
    }
    // 'deleted' status is not added to usedBytes
  }

  const freeBytes = Math.max(0, capacity - usedBytes);
  const netDeltaBytes = initialUsed - usedBytes;
  const freedBytes = Math.max(0, netDeltaBytes);

  return {
    capacityBytes: capacity,
    usedBytes,
    trashBytes,
    activeBytes,
    freeBytes,
    freedBytes,
    netDeltaBytes,
  };
}

/**
 * Decimal byte formatting (1 kB = 1.000 B, 1 MB = 1.000.000 B, 1 GB = 1.000.000.000 B)
 * Spanish notation with comma as decimal separator.
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const isNegative = bytes < 0;
  const absBytes = Math.abs(bytes);

  const k = 1000;
  const sizes = ['B', 'kB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(absBytes) / Math.log(k));
  const safeI = Math.min(i, sizes.length - 1);

  if (safeI === 0) {
    return `${isNegative ? '-' : ''}${absBytes} B`;
  }

  const value = absBytes / Math.pow(k, safeI);
  const formattedValue = value
    .toFixed(decimals)
    .replace('.', ',')
    .replace(/,0$/, '');

  return `${isNegative ? '-' : ''}${formattedValue} ${sizes[safeI]}`;
}


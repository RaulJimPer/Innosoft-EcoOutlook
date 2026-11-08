import { DatasetState } from '../../domain/types';
import { buildDataset } from './generateDataset';

let cachedInitialDataset: DatasetState | null = null;

export function getInitialDataset(): DatasetState {
  if (!cachedInitialDataset) {
    cachedInitialDataset = buildDataset();
  }
  // Deep clone to guarantee complete isolation across runs
  return JSON.parse(JSON.stringify(cachedInitialDataset));
}


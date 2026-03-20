import { query } from './query';
import { storage } from './storage';

export const infra = {
  ...query,
  ...storage,
} as const;

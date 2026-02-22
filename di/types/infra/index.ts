import { ai } from './ai';
import { logger } from './logger';
import { query } from './query';
import { storage } from './storage';

export const infra = {
  ...ai,
  ...query,
  ...storage,
  ...logger,
} as const;

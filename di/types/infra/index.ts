import { logger } from './logger';
import { query } from './query';
import { storage } from './storage';

export const infra = {
  ...query,
  ...storage,
  ...logger,
} as const;

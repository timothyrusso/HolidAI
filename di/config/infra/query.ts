import { TYPES } from '@/di/types';
import { QueryClient } from '@tanstack/react-query';
import { container } from 'tsyringe';

const queryInstance = new QueryClient();

container.registerInstance(TYPES.QUERY, queryInstance);

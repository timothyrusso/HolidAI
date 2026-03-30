import type { IRouterClient } from '@/features/core/navigation/domain/entities/services/IRouterClient';
import { router } from 'expo-router';

export const routerClient: IRouterClient = {
  push: href => router.push(href as Parameters<typeof router.push>[0]),
  replace: href => router.replace(href as Parameters<typeof router.replace>[0]),
  back: () => router.back(),
  dismissAll: () => router.dismissAll(),
};

import type { IRouterClient } from '@/features/core/navigation/domain/entities/services/IRouterClient';
import { type Href, router } from 'expo-router';

export const routerClient: IRouterClient = {
  push: href => router.push(href as Href),
  replace: href => router.replace(href as Href),
  back: () => router.back(),
  dismissAll: () => router.dismissAll(),
};

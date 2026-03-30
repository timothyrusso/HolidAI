export type NavigationHref = string | { pathname: string; params?: Record<string, string | number> };

export interface IRouterClient {
  push(href: NavigationHref): void;
  replace(href: NavigationHref): void;
  back(): void;
  dismissAll(): void;
}

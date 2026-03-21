export const ToastType = {
  ERROR: 'error',
  SUCCESS: 'success',
  INFO: 'info',
} as const;

export type ToastType = (typeof ToastType)[keyof typeof ToastType];

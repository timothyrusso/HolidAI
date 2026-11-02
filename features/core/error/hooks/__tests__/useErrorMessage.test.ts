import { renderHook } from '@testing-library/react-native';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NetworkFailure, UnexpectedError } from '@/features/core/error';
import { useErrorMessage } from '@/features/core/error/hooks/useErrorMessage';

const CATALOG = { ERRORS: { GENERIC: 'Something went wrong', NETWORK: 'Network error, please try again' } };

beforeAll(async () => {
  await i18next
    .use(initReactI18next)
    .init({ lng: 'en', showSupportNotice: false, resources: { en: { translation: CATALOG } } });
});

describe('useErrorMessage', () => {
  it('returns the catalog message for the error tag', async () => {
    const { result } = await renderHook(() => useErrorMessage(new NetworkFailure({ url: 'https://api.unsplash.com' })));

    expect(result.current).toBe('Network error, please try again');
  });

  it('returns the generic message for an UnexpectedError', async () => {
    const { result } = await renderHook(() => useErrorMessage(new UnexpectedError({ cause: new Error('boom') })));

    expect(result.current).toBe('Something went wrong');
  });

  it('returns undefined when there is no error', async () => {
    const { result } = await renderHook(() => useErrorMessage(null));

    expect(result.current).toBeUndefined();
  });
});

import { act, waitFor } from '@testing-library/react-native';
import i18next from 'i18next';
import { renderWithLayer, StorageFake } from '@/features/core/testing';
import { useChangeLanguage } from '@/features/core/translations/facades/useChangeLanguage';

afterEach(async () => {
  await i18next.changeLanguage('en');
});

describe('useChangeLanguage', () => {
  it('shows the language the app is in', async () => {
    const { result, done } = await renderWithLayer(StorageFake().layer, useChangeLanguage, undefined);

    expect(result.current.language).toBe('en');
    await done();
  });

  it('switches to the language picked', async () => {
    const { result, done } = await renderWithLayer(StorageFake().layer, useChangeLanguage, undefined);

    await act(async () => result.current.changeLanguage('it'));

    await waitFor(() => expect(result.current.language).toBe('it'));
    await done();
  });

  it('remembers the language picked for the next launch', async () => {
    const storage = StorageFake();
    const { result, done } = await renderWithLayer(storage.layer, useChangeLanguage, undefined);

    await act(async () => result.current.changeLanguage('it'));

    await waitFor(() => expect(storage.values.get('app_language')).toBe('it'));
    await done();
  });

  it('still switches, and logs the StorageFailure, when the language cannot be saved', async () => {
    const { result, logs, done } = await renderWithLayer(StorageFake({}, true).layer, useChangeLanguage, undefined);

    await act(async () => result.current.changeLanguage('it'));

    await waitFor(() => expect(logs.entries.map(entry => entry.message)).toEqual(['StorageFailure']));
    expect(result.current.language).toBe('it');
    await done();
  });
});

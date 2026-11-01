import { act, waitFor } from '@testing-library/react-native';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { GeminiExtractionError, GeminiSearchError } from '@/features/ai';
import { renderWithLayer } from '@/features/core/testing';
import { aGeneratedTrip, aTripRequest } from '@/features/trip-generation/__fixtures__/builders';
import { AiServiceFake } from '@/features/trip-generation/di/__tests__/aiServiceFake';
import { useGenerateTrip } from '@/features/trip-generation/facades/useGenerateTrip';
import { useTripGenerationStore } from '@/features/trip-generation/state/tripGenerationStore';

const answers = AiServiceFake();
const notATrip = AiServiceFake({ extract: [new GeminiExtractionError({ transient: false })] });
const searchFails = AiServiceFake({ search: [new GeminiSearchError({ transient: false })] });

const wizardBudget = () => useTripGenerationStore.getState().budgetInfo;

beforeAll(async () => {
  await i18next.use(initReactI18next).init({ lng: 'en', showSupportNotice: false, resources: {} });
});

beforeEach(() => {
  useTripGenerationStore.getState().actions.setBudgetInfo('Moderate');
});

afterEach(() => {
  useTripGenerationStore.getState().actions.resetTripGenerationState();
});

describe('useGenerateTrip', () => {
  it('returns the generated trip and clears the wizard', async () => {
    const { result, done } = await renderWithLayer(answers.layer, useGenerateTrip, undefined);

    await act(async () => result.current.generate(aTripRequest()));

    await waitFor(() => expect(result.current.trip).toEqual(aGeneratedTrip()));
    expect(wizardBudget()).toBe('');
    await done();
  });

  it('reports a GeminiExtractionError as its error and keeps the wizard', async () => {
    const { result, done } = await renderWithLayer(notATrip.layer, useGenerateTrip, undefined);

    await act(async () => result.current.generate(aTripRequest()));

    await waitFor(() => expect(result.current.error?._tag).toBe('GeminiExtractionError'));
    expect(wizardBudget()).toBe('Moderate');
    await done();
  });

  it('reports a GeminiSearchError as its error and keeps the wizard', async () => {
    const { result, done } = await renderWithLayer(searchFails.layer, useGenerateTrip, undefined);

    await act(async () => result.current.generate(aTripRequest()));

    await waitFor(() => expect(result.current.error?._tag).toBe('GeminiSearchError'));
    expect(wizardBudget()).toBe('Moderate');
    await done();
  });
});

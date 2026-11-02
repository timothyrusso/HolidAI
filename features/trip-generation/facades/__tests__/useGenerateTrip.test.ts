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

/** Renders the facade over `fake`, generates a trip, runs `check`, and always disposes the runtime. */
const generateWith = async (
  fake: ReturnType<typeof AiServiceFake>,
  check: (current: ReturnType<typeof useGenerateTrip>) => void,
) => {
  const { result, done } = await renderWithLayer(fake.layer, useGenerateTrip, undefined);
  try {
    await act(async () => result.current.generate(aTripRequest()));
    await waitFor(() => check(result.current));
  } finally {
    await done();
  }
};

describe('useGenerateTrip', () => {
  it('returns the generated trip', async () => {
    await generateWith(answers, current => expect(current.trip).toEqual(aGeneratedTrip()));
  });

  it('clears the wizard once it has a trip', async () => {
    await generateWith(answers, () => expect(wizardBudget()).toBe(''));
  });

  it('reports a GeminiExtractionError as its error', async () => {
    await generateWith(notATrip, current => expect(current.error?._tag).toBe('GeminiExtractionError'));
  });

  it('keeps the wizard when the extraction fails', async () => {
    await generateWith(notATrip, current => {
      expect(current.error).not.toBeNull();
      expect(wizardBudget()).toBe('Moderate');
    });
  });

  it('reports a GeminiSearchError as its error', async () => {
    await generateWith(searchFails, current => expect(current.error?._tag).toBe('GeminiSearchError'));
  });

  it('keeps the wizard when the search fails', async () => {
    await generateWith(searchFails, current => {
      expect(current.error).not.toBeNull();
      expect(wizardBudget()).toBe('Moderate');
    });
  });
});

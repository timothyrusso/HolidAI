import { waitFor } from '@testing-library/react-native';
import { api } from '@/convex/_generated/api';
import { GeminiSearchError } from '@/features/ai';
import { clerkFake, convexFake, renderWithLayer, routerFake } from '@/features/core/testing';
import { AiServiceFake } from '@/features/trip-generation/di/__tests__/aiServiceFake';
import { GenerationFake } from '@/features/trip-generation/di/__tests__/tripImagesFake';
import { useTripGenerationStore } from '@/features/trip-generation/state/tripGenerationStore';
import { useGenerateTripPageLogic } from '@/features/trip-generation/ui/pages/GenerateTripPage/GenerateTripPage.logic';

const answers = GenerationFake(AiServiceFake());
const searchFails = GenerationFake(AiServiceFake({ search: [new GeminiSearchError({ transient: false })] }));

/** The QA user's Convex records: `tokens` left, and the trips and spends the page sends. */
const aBackend = (tokens: number) => {
  const balance = { tokens, created: 0 };
  convexFake.setQuery(api.users.getUserTokens, () => balance.tokens);
  convexFake.setMutation(api.users.decrementUserTokens, args => {
    balance.tokens -= args.amount;
  });
  convexFake.setMutation(api.trips.createTrip, () => {
    balance.created += 1;
    return 'trip_kyoto';
  });
  return balance;
};

const aWizard = () =>
  useTripGenerationStore.setState({
    locationInfo: { name: 'Kyoto, Japan', coordinates: undefined, photoRef: '', url: '' },
    travelerType: 'Couple',
    travelersNumber: 2,
    datesInfo: {
      startDate: new Date('2026-05-12T00:00:00Z'),
      endDate: new Date('2026-05-15T00:00:00Z'),
      totalNoOfDays: 4,
    },
    budgetInfo: 'Moderate',
  });

const destinations = () => routerFake.history.map(({ verb, href }) => ({ verb, href }));

beforeEach(() => {
  clerkFake.signIn();
  aWizard();
});

afterEach(() => {
  useTripGenerationStore.getState().actions.resetTripGenerationState();
});

describe('useGenerateTripPageLogic', () => {
  it('generates and saves the trip, then opens it', async () => {
    aBackend(10);
    const { result, done } = await renderWithLayer(answers, useGenerateTripPageLogic, undefined);

    await waitFor(() => expect(result.current.state.isLoading).toBe(false));
    expect(destinations()).toEqual([
      {
        verb: 'push',
        href: { pathname: '/create-trip/trip-details', params: { id: 'trip_kyoto', fromGenerate: 'true' } },
      },
    ]);
    await done();
  });

  it('spends a token per day of the trip once it is saved', async () => {
    const backend = aBackend(10);
    const { done } = await renderWithLayer(answers, useGenerateTripPageLogic, undefined);

    await waitFor(() => expect(backend.tokens).toBe(6));
    await done();
  });

  it('goes home without generating when the user has no tokens left', async () => {
    const backend = aBackend(0);
    const { done } = await renderWithLayer(answers, useGenerateTripPageLogic, undefined);

    await waitFor(() => expect(destinations()).toEqual([{ verb: 'replace', href: '/home-page' }]));
    expect(backend.created).toBe(0);
    await done();
  });

  it('goes home, saving nothing and spending nothing, when the generation fails', async () => {
    const backend = aBackend(10);
    const { result, done } = await renderWithLayer(searchFails, useGenerateTripPageLogic, undefined);

    await waitFor(() => expect(result.current.state.isLoading).toBe(false));
    expect(destinations()).toEqual([{ verb: 'replace', href: '/home-page' }]);
    expect(backend).toEqual({ tokens: 10, created: 0 });
    await done();
  });

  it('goes home, spending nothing, when the trip cannot be saved', async () => {
    const backend = aBackend(10);
    convexFake.failMutation(api.trips.createTrip);
    const { result, done } = await renderWithLayer(answers, useGenerateTripPageLogic, undefined);

    await waitFor(() => expect(result.current.state.isLoading).toBe(false));
    expect(destinations()).toEqual([{ verb: 'replace', href: '/home-page' }]);
    expect(backend.tokens).toBe(10);
    await done();
  });
});

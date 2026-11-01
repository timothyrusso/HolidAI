import { Either, Schema } from 'effect';
import answer from '@/features/ai/__fixtures__/generatedTripAnswer.json';
import { GeneratedTripResponseDTO } from '@/features/ai/data/dtos/GeneratedTripResponseDTO';
import { GeneratedTripSchema } from '@/features/ai/domain/schemas/GeneratedTripSchema';

const decodeDomain = (input: unknown) => Schema.decodeUnknownEither(GeneratedTripSchema)(input);
const decodeSdk = (input: unknown) => GeneratedTripResponseDTO.safeParse(input);

describe('GeneratedTripSchema mirrors GeneratedTripResponseDTO', () => {
  it('decodes a model answer to the trip the SDK schema parses', () => {
    const sdk = decodeSdk(answer);

    expect(sdk.success).toBe(true);
    expect(decodeDomain(answer)).toEqual(Either.right(sdk.data));
  });

  it('both normalize a DD/MM/YYYY date to ISO', () => {
    const domain = Schema.decodeUnknownSync(GeneratedTripSchema)(answer);

    expect(domain.tripDetails.startDate).toBe('2026-05-12');
    expect(decodeSdk(answer).data?.tripDetails.startDate).toBe('2026-05-12');
  });

  it('both default the fields the enrichment fills to empty', () => {
    const domain = Schema.decodeUnknownSync(GeneratedTripSchema)(answer);

    expect(domain.dayPlans[0]?.schedule[0]?.photoResourceNames).toEqual([]);
    expect(domain.food.typicalDishes[0]?.imageUrl).toBe('');
    expect(domain.coverImage).toEqual({ url: '', blurHash: '' });
    expect(decodeSdk(answer).data?.coverImage).toEqual({ url: '', blurHash: '' });
  });

  it('both reject a rating above 5', () => {
    const tooGood = withFirstPlace({ rating: 6 });

    expect(Either.isLeft(decodeDomain(tooGood))).toBe(true);
    expect(decodeSdk(tooGood).success).toBe(false);
  });

  it('both reject an answer without day plans', () => {
    const { dayPlans: _dayPlans, ...withoutDayPlans } = answer;

    expect(Either.isLeft(decodeDomain(withoutDayPlans))).toBe(true);
    expect(decodeSdk(withoutDayPlans).success).toBe(false);
  });

  it('both reject a place whose ticket price is text', () => {
    const textPrice = withFirstPlace({ ticketPricing: 'free' });

    expect(Either.isLeft(decodeDomain(textPrice))).toBe(true);
    expect(decodeSdk(textPrice).success).toBe(false);
  });
});

/** The fixture answer with its first place changed by `overrides`. */
function withFirstPlace(overrides: Record<string, unknown>) {
  const [first, ...rest] = answer.dayPlans;
  const [place, ...places] = first.schedule;
  return { ...answer, dayPlans: [{ ...first, schedule: [{ ...place, ...overrides }, ...places] }, ...rest] };
}

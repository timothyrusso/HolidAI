import { Schema } from 'effect';
import { GeneratedTripSchema } from '@/features/ai';
import { aGeneratedTrip } from '@/features/trip-generation/__fixtures__/builders';

describe('aGeneratedTrip', () => {
  it('builds a trip that decodes through GeneratedTripSchema unchanged', () => {
    expect(Schema.decodeUnknownSync(GeneratedTripSchema)(aGeneratedTrip())).toEqual(aGeneratedTrip());
  });
});

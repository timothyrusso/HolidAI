import { Schema } from 'effect';
import { GeneratedTripSchema } from '@/features/ai';
import { aTripAiResp } from '@/features/trips/__fixtures__/builders';

describe('aTripAiResp', () => {
  it('builds a trip that decodes through GeneratedTripSchema unchanged', () => {
    expect(Schema.decodeUnknownSync(GeneratedTripSchema)(aTripAiResp())).toEqual(aTripAiResp());
  });
});

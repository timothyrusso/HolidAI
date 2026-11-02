import { waitFor } from '@testing-library/react-native';
import type { ImageRequest } from '@/features/core/images/domain/entities/ImageRequest';
import { useGetImage } from '@/features/core/images/facades/useGetImage';
import { ImageRepositoryFake, renderWithLayer } from '@/features/core/testing';

const KYOTO = { url: 'https://images.unsplash.com/kyoto-regular', blurHash: 'LEHV6nWB2yk8' };
const images = ImageRepositoryFake({ Kyoto: KYOTO, Carbonara: 'fail' });

describe('useGetImage', () => {
  it('returns the image the provider found', async () => {
    const { result, done } = await renderWithLayer(images, useGetImage, aRequest());

    await waitFor(() => expect(result.current.data).toEqual(KYOTO));
    expect(result.current.isLoading).toBe(false);
    await done();
  });

  it('shows the no-image placeholder when the provider has no image', async () => {
    const { result, done } = await renderWithLayer(images, useGetImage, aRequest({ query: 'Nowhere' }));

    await waitFor(() => expect(result.current.data?.url).toEqual(anAsset('no-image-placeholder.jpg')));
    await done();
  });

  it('shows the food placeholder when a dish image fails', async () => {
    const { result, done } = await renderWithLayer(
      images,
      useGetImage,
      aRequest({ source: 'wikimediaDish', query: 'Carbonara' }),
    );

    await waitFor(() => expect(result.current.data?.url).toEqual(anAsset('food_placeholder.jpg')));
    await done();
  });

  it('does not search for an empty query', async () => {
    const { result, logs, done } = await renderWithLayer(images, useGetImage, aRequest({ query: '' }));

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(logs.entries).toEqual([]);
    await done();
  });
});

function aRequest(overrides: Partial<ImageRequest> = {}): ImageRequest {
  return { source: 'unsplash', query: 'Kyoto', urlType: 'regular', ...overrides } as ImageRequest;
}

/** A bundled image as jest's asset transform hands it out. */
function anAsset(fileName: string) {
  return { testUri: expect.stringContaining(fileName) };
}

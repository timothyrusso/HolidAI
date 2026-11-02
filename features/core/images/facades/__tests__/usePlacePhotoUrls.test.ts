import { waitFor } from '@testing-library/react-native';
import { usePlacePhotoUrls } from '@/features/core/images/facades/usePlacePhotoUrls';
import { ImageRepositoryFake, renderWithLayer } from '@/features/core/testing';

const images = ImageRepositoryFake();
const usePhotos = (names: readonly string[]) => usePlacePhotoUrls(names, 50);

describe('usePlacePhotoUrls', () => {
  it('returns the media URL of each photo', async () => {
    const { result, done } = await renderWithLayer(images, usePhotos, ['places/ChIJ1/photos/AU1']);

    await waitFor(() =>
      expect(result.current).toEqual([
        'https://places.googleapis.com/v1/places/ChIJ1/photos/AU1/media?key=places-test-key&maxWidthPx=50',
      ]),
    );
    await done();
  });

  it('returns no URL, and builds none, for no photo', async () => {
    const { result, logs, done } = await renderWithLayer(images, usePhotos, []);

    expect(result.current).toEqual([]);
    expect(logs.entries).toEqual([]);
    await done();
  });
});

import { Layer } from 'effect';
import { ImageRepositoryFake } from '@/features/core/testing';
import type { AiServiceFake } from '@/features/trip-generation/di/__tests__/aiServiceFake';

export const KYOTO_COVER = { url: 'https://images.unsplash.com/kyoto-regular', blurHash: 'LEHV6nWB2yk8' };
export const YUDOFU_PICTURE = 'https://upload.wikimedia.org/yudofu.jpg';
export const KIYOMIZU_PHOTOS = ['places/ChIJk/photos/AU1', 'places/ChIJk/photos/AU2'];

/** The image providers with a cover of Kyoto, a picture of yudofu and photos of Kiyomizu-dera. */
export const KyotoImagesFake = () =>
  ImageRepositoryFake(
    { Kyoto: KYOTO_COVER, yudofu: { url: YUDOFU_PICTURE } },
    { 'Kiyomizu-dera, Kyoto': KIYOMIZU_PHOTOS },
  );

/** The image providers, every lookup failing. */
export const ImagesDownFake = () =>
  ImageRepositoryFake({ Kyoto: 'fail', yudofu: 'fail' }, { 'Kiyomizu-dera, Kyoto': 'fail' });

/** The model and the image providers a generation runs on. */
export const GenerationFake = (ai: ReturnType<typeof AiServiceFake>, images = KyotoImagesFake()) =>
  Layer.merge(ai.layer, images);

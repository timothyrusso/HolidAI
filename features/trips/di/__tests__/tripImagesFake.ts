import { Layer } from 'effect';
import { ImageRepositoryFake, NetworkFake } from '@/features/core/testing';

export const LISBON_COVER = { url: 'https://images.unsplash.com/lisbon-new', blurHash: 'LEHV6nWB2yk8' };
export const NATA_PICTURE = 'https://upload.wikimedia.org/pastel-de-nata-new.jpg';
export const MONASTERY_PHOTOS = ['places/ChIJ1/photos/NEW1', 'places/ChIJ1/photos/NEW2'];

/**
 * The image providers and the network the trips facades retry through: Unsplash has a new cover of
 * Lisbon, Wikimedia a new pastel de nata and Places new photos of the monastery; Porto fails.
 */
export const TripImagesFake = (network: 'online' | 'offline' = 'online') =>
  Layer.merge(
    ImageRepositoryFake(
      { Lisbon: LISBON_COVER, 'pastel de nata': { url: NATA_PICTURE }, Porto: 'fail' },
      { 'Jerónimos Monastery, Lisbon': MONASTERY_PHOTOS },
    ),
    NetworkFake(network),
  );

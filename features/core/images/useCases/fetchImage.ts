import { Effect } from 'effect';
import type { ImageRequest } from '@/features/core/images/domain/entities/ImageRequest';
import { ImageRepository } from '@/features/core/images/domain/repositories/ImageRepository';

/** The image for `request`, or `null` when its provider has none. */
export const fetchImage = (request: ImageRequest) =>
  Effect.flatMap(ImageRepository, repository => repository.getImage(request));

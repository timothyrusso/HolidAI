import { ImageRepositoryLive } from '@/features/core/images/data/repositories/imageRepositoryLive';

/** The images feature's Layer: leaves `HttpClient` and `AppConfig` for the runtime to provide. */
export const ImagesLive = ImageRepositoryLive;

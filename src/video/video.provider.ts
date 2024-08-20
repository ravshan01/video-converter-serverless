export const VIDEO_PROVIDER_KEY = 'VIDEO_PROVIDER';

export interface IVideoProvider {
  isVideoExtension(path: string): boolean;
}

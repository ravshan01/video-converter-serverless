import { Readable } from 'node:stream';

export const VIDEO_PROVIDER_KEY = 'VIDEO_PROVIDER';

export interface IVideoProvider {
  isVideoExtension(path: string): boolean;
  convert(
    video: Buffer | ArrayBuffer | Uint8Array | Readable,
    options: IVideoProviderConvertOptions,
  ): Readable;
}

export interface IVideoProviderConvertOptions {
  container: string;
  codec?: string;
  audioCodec?: string;
  /**
   * WIDTHxHEIGHT
   * @example 1280x720
   */
  size?: string;
  bitrate?: string | number;
  fps?: number | string;
  preset?: string;
}

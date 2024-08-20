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
  preset?:
    | 'ultrafast'
    | 'superfast'
    | 'veryfast'
    | 'faster'
    | 'fast'
    | 'medium'
    | 'slow'
    | 'slower'
    | 'veryslow';
  /**
   * CRF (Constant Rate Factor) — это параметр,
   *   используемый в ffmpeg для управления качеством видео при кодировании с использованием кодека H.264 или H.265.
   * Он определяет баланс между качеством видео и размером файла.
   * Значения CRF варьируются от 0 до 51, где:
   * 0 — это наивысшее качество (без потерь), но самый большой размер файла.
   * 23 — это значение по умолчанию, обеспечивающее хорошее качество при разумном размере файла.
   * 51 — это наименьшее качество и самый маленький размер файла.
   * Низкие значения CRF дают лучшее качество, но увеличивают размер файла, в то время как высокие значения уменьшают качество и размер файла.
   */
  crf?: number;
}

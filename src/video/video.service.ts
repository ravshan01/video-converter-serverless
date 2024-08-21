import { PassThrough, Readable } from 'node:stream';

import * as ffmpeg from 'fluent-ffmpeg';
import { lookup } from 'mime-types';

import { Injectable } from '@nestjs/common';

import { bufferToStream } from '../common/utils/buffer-to-stream.util';
import { IVideoProvider, IVideoProviderConvertOptions } from './video.provider';

@Injectable()
export class VideoService implements IVideoProvider {
  isVideoExtension(path: string) {
    const mimeType = lookup(path);
    return mimeType ? mimeType.includes('video') : false;
  }

  convert(
    video: Buffer | ArrayBuffer | Uint8Array | Readable,
    options: IVideoProviderConvertOptions,
  ): Readable {
    const stream =
      video instanceof Readable ? video : bufferToStream(Buffer.from(video));
    const passThrough = new PassThrough();

    const outputOptions = [`-f ${options.container}`, '-movflags +faststart'];
    if (options.codec) outputOptions.push(`-vcodec ${options.codec}`);
    if (options.audioCodec) outputOptions.push(`-acodec ${options.audioCodec}`);
    if (options.bitrate) outputOptions.push(`-b:v ${options.bitrate}`);
    if (options.audioBitrate)
      outputOptions.push(`-b:a ${options.audioBitrate}`);
    if (options.size) outputOptions.push(`-s ${options.size}`);
    if (options.fps) outputOptions.push(`-r ${options.fps}`);
    if (options.preset) outputOptions.push(`-preset ${options.preset}`);
    if (options.crf) outputOptions.push(`-crf ${options.crf}`);

    const command = ffmpeg(stream).outputOptions(outputOptions);
    command.pipe(passThrough, { end: true });

    return passThrough;
  }
}

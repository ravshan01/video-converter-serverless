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

    const command = ffmpeg(stream).outputOptions(
      [
        // '-qscale:v 4',
        `-f ${options.container}`,
        options.codec ? `-vcodec ${options.codec}` : '',
        options.audioCodec ? `-acodec ${options.audioCodec}` : '',
        options.size ? `-s ${options.size}` : '',
        options.bitrate ? `-b:v ${options.bitrate}` : '',
        options.fps ? `-r ${options.fps}` : '',
        options.preset ? `-preset ${options.preset}` : '',
        '-movflags +faststart', // moves file metadata to the beginning of the file
      ].filter(Boolean),
    );

    command.pipe(passThrough, { end: true });

    return passThrough;
  }
}

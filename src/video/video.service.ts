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
    video: string | Buffer | ArrayBuffer | Uint8Array | Readable,
    options: IVideoProviderConvertOptions,
    logs?:
      | boolean
      | {
          start?: boolean;
          progress?: boolean;
          codecData?: boolean;
          error?: boolean;
          stderr?: boolean;
          end?: boolean;
        },
  ): Readable {
    const input = this.getCorrectFfmpegVideoInput(video);
    const passThrough = new PassThrough();
    const command = ffmpeg(input);

    if (options.analyzeDuration)
      command.inputOptions(`-analyzeduration ${options.analyzeDuration}`);
    if (options.probeSize)
      command.inputOptions(`-probesize ${options.probeSize}`);

    command.format(options.container); // -f ${options.container}
    // 'frag_keyframe' allows fragmented output &
    // 'empty_moov' will cause output to be 100% fragmented; without this the first fragment will be muxed as a short movie (using moov) followed by the rest of the media in fragments.
    // 'faststart' will move the moov atom to the beginning of the file, which allows you to play a video before it is completely downloaded
    command.outputOptions(['-movflags frag_keyframe+empty_moov+faststart']);
    if (options.codec) command.videoCodec(options.codec); // -vcodec ${options.codec}
    if (options.audioCodec) command.audioCodec(options.audioCodec); // -acodec ${options.audioCodec}
    if (options.bitrate) command.videoBitrate(options.bitrate); // -b:v ${options.bitrate}
    if (options.audioBitrate) command.audioBitrate(options.audioBitrate); // -b:a ${options.audioBitrate}
    if (options.size) command.size(options.size); // -s ${options.size}
    if (options.fps) command.fps(options.fps); // -r ${options.fps}
    if (options.preset) command.outputOption(`-preset ${options.preset}`);
    if (options.crf) command.outputOption(`-crf ${options.crf}`);
    if (options.pixFmt) command.outputOption(`-pix_fmt ${options.pixFmt}`);

    this.addLogsOnCommand(command, logs);
    command.pipe(passThrough, { end: true });

    return passThrough;
  }

  private getCorrectFfmpegVideoInput(
    video: string | Buffer | ArrayBuffer | Uint8Array | Readable,
  ): string | Readable {
    if (typeof video === 'string' || video instanceof Readable) return video;
    return bufferToStream(Buffer.from(video));
  }

  private addLogsOnCommand(
    command: ffmpeg.FfmpegCommand,
    logs:
      | boolean
      | {
          start?: boolean;
          progress?: boolean;
          codecData?: boolean;
          error?: boolean;
          stderr?: boolean;
          end?: boolean;
        },
  ) {
    if (!logs) return;

    if (logs === true || logs.start) {
      command.on('start', (commandLine) => {
        console.log(
          'VideoService.convert. Spawned Ffmpeg with command: ' + commandLine,
        );
      });
    }
    if (logs === true || logs.progress) {
      command.on('progress', (progress) => {
        console.log('VideoService.convert. Progress', progress);
      });
    }
    if (logs === true || logs.codecData) {
      command.on('codecData', (data) => {
        console.log('VideoService.convert, codecData', data);
      });
    }
    if (logs === true || logs.error) {
      command.on('error', (err) => {
        console.error('VideoService.convert. Error: ' + err.message);
      });
    }
    if (logs === true || logs.stderr) {
      command.on('stderr', (stderrLine) => {
        console.log('VideoService.convert. Stderr output: ' + stderrLine);
      });
    }
    if (logs === true || logs.end) {
      command.on('end', () => {
        console.log('VideoService.convert. Finished');
      });
    }
  }
}

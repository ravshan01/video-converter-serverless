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
    const stream =
      video instanceof Readable ? video : bufferToStream(Buffer.from(video));
    const passThrough = new PassThrough();

    const inputOptions = [];
    if (options.analyzeDuration)
      inputOptions.push(`-analyzeduration ${options.analyzeDuration}`);
    if (options.probeSize) inputOptions.push(`-probesize ${options.probeSize}`);

    const outputOptions = [
      `-f ${options.container}`,
      // '-movflags +faststart',

      // 'frag_keyframe', 'empty_moov' for fix output stream video
      // 'frag_keyframe' allows fragmented output &
      // 'empty_moov' will cause output to be 100% fragmented; without this the first fragment will be muxed as a short movie (using moov) followed by the rest of the media in fragments.
      // 'faststart' will move the moov atom to the beginning of the file, which allows you to play a video before it is completely downloaded
      '-movflags frag_keyframe+empty_moov+faststart',
    ];
    if (options.codec) outputOptions.push(`-vcodec ${options.codec}`);
    if (options.audioCodec) outputOptions.push(`-acodec ${options.audioCodec}`);
    if (options.bitrate) outputOptions.push(`-b:v ${options.bitrate}`);
    if (options.audioBitrate)
      outputOptions.push(`-b:a ${options.audioBitrate}`);
    if (options.size) outputOptions.push(`-s ${options.size}`);
    if (options.fps) outputOptions.push(`-r ${options.fps}`);
    if (options.preset) outputOptions.push(`-preset ${options.preset}`);
    if (options.crf) outputOptions.push(`-crf ${options.crf}`);

    const command = ffmpeg(stream)
      .inputOptions(inputOptions)
      .outputOptions(outputOptions);

    this.addLogsOnCommand(command, logs);

    // const outputPath = join(
    //   __dirname,
    //   `./converted/video.${options.container}`,
    // );
    // command.saveToFile(outputPath);
    command.pipe(passThrough, { end: true });

    return passThrough;
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

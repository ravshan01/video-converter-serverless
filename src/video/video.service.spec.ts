import { createWriteStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { Readable } from 'node:stream';

import { ensureDir } from 'fs-extra';

import { Test, TestingModule } from '@nestjs/testing';

import { MOCK_VIDEOS } from './mock';
import { IVideoProviderConvertOptions } from './video.provider';
import { VideoService } from './video.service';

describe('VideoService', () => {
  let service: VideoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoService],
    }).compile();

    service = module.get<VideoService>(VideoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isVideoExtension', () => {
    it('should return true if the path is a video extension', async () => {
      const correctPaths = [
        'test.mp4',
        'test.mkv',
        'test.webm',
        'folder/1.mp4',
        'folder/subfolder/1.mp4',
      ];

      for (const path of correctPaths) {
        const result = service.isVideoExtension(path);
        expect(result).toBe(true);
      }
    });

    it('should return false if the path is not a video extension', () => {
      const incorrectPaths = [
        'test.txt',
        'test.jpg',
        'test.png',
        'folder/1.mp4.txt',
        'folder/subfolder/1.webm.txt',
        'text',
        '123',
      ];

      for (const path of incorrectPaths) {
        const result = service.isVideoExtension(path);
        expect(result).toBe(false);
      }
    });
  });

  describe('convert', () => {
    const codecsByContainer = {
      mp4: {
        codec: 'libx264',
        audioCodec: 'aac',
      },
      webm: {
        codec: 'libvpx-vp9',
        audioCodec: 'libopus',
      },
      avi: {
        codec: 'libx264',
        audioCodec: 'aac',
      },
    };

    it.todo('should convert and optimize the video from Readable');
    it.todo('should convert and optimize the video from Buffer');
    it.todo('should convert and optimize the video from ArrayBuffer');
    it.todo('should convert and optimize the video from Uint8Array');
    it('should convert and optimize the video from string(path)', async () => {
      const mockVideo = MOCK_VIDEOS.WithAudio.MP4;
      const container = 'mp4';
      const options: IVideoProviderConvertOptions = {
        container,
        ...codecsByContainer[container],

        size: '1280x720',
        crf: 28,
        preset: 'slow',
        fps: 20,
        // bitrate: '1M',
      };

      const stream = service.convert(mockVideo.path, options, true);
      expect(stream).toBeDefined();
      expect(stream).toBeInstanceOf(Readable);

      const outputPath = join(
        __dirname,
        `./converted/${generateConvertedVideoFileName(mockVideo.name, options)}`,
      );
      await ensureDir(dirname(outputPath));

      const output = createWriteStream(outputPath);
      stream.pipe(output);
      await new Promise((resolve) => output.on('finish', resolve));

      const stats = await stat(mockVideo.path);
      expect(output.bytesWritten).toBeGreaterThan(0);
      expect(output.bytesWritten).toBeLessThan(stats.size);
    }, 60000);
  });
});

function generateConvertedVideoFileName(
  fileName: string,
  options: IVideoProviderConvertOptions,
) {
  const { container, ...restOptions } = options;

  const optionsString = Object.entries(restOptions)
    .map(([key, value]) => `${key}=${value}`)
    .join('__');
  return `${fileName}__${optionsString}.${container}`;
}

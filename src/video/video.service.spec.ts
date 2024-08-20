import { Test, TestingModule } from '@nestjs/testing';

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
        const result = await service.isVideoExtension(path);
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
});

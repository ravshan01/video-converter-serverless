import { join } from 'node:path';

export const MOCK_VIDEOS = {
  WithoutAudio: {
    MP4: {
      name: 'video-without-audio',
      path: join(__dirname, 'video-without-audio.mp4'),
    },
    WebM: {
      name: 'video-without-audio',
      path: join(__dirname, 'video-without-audio.webm'),
    },
  },
  WithAudio: {
    MP4: {
      name: 'video-with-audio',
      path: join(__dirname, 'video-with-audio.mp4'),
    },
  },
};

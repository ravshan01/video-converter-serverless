import { join } from 'node:path';

export const MOCK_VIDEOS = {
  WithoutAudio: {
    MP4: {
      path: join(__dirname, 'video-without-audio.mp4'),
    },
    WebM: {
      path: join(__dirname, 'video-without-audio.webm'),
    },
  },
  WithAudio: {
    MP4: {
      path: join(__dirname, 'video-with-audio.mp4'),
    },
  },
};

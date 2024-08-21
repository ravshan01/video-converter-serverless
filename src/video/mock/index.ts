import { join } from 'node:path';

export const MOCK_VIDEOS = {
  WithoutAudio: {
    MP4: {
      name: 'video-without-audio-mp4',
      path: join(__dirname, 'video-without-audio.mp4'),
    },
    WebM: {
      name: 'video-without-audio-webm',
      path: join(__dirname, 'video-without-audio.webm'),
    },
    AVI: {
      name: 'video-without-audio-avi',
      path: join(__dirname, 'video-without-audio.avi'),
    },
  },
  WithAudio: {
    MP4: {
      name: 'video-with-audio-mp4',
      path: join(__dirname, 'video-with-audio.mp4'),
    },
  },
};

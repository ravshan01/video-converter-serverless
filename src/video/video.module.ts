import { Module } from '@nestjs/common';

import { VIDEO_PROVIDER_KEY } from './video.provider';
import { VideoService } from './video.service';

@Module({
  providers: [
    {
      provide: VIDEO_PROVIDER_KEY,
      useClass: VideoService,
    },
  ],
})
export class VideoModule {}

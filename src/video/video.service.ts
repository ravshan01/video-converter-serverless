import { lookup } from 'mime-types';

import { Injectable } from '@nestjs/common';

import { IVideoProvider } from './video.provider';

@Injectable()
export class VideoService implements IVideoProvider {
  isVideoExtension(path: string) {
    const mimeType = lookup(path);
    return mimeType ? mimeType.includes('video') : false;
  }
}

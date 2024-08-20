import { lookup } from 'mime-types';

import { Injectable } from '@nestjs/common';

@Injectable()
export class VideoService {
  async isVideoExtension(path: string) {
    const mimeType = lookup(path);
    return mimeType ? mimeType.includes('video') : mimeType;
  }
}

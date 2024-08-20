import { Module } from '@nestjs/common';

import { S3_PROVIDER_KEY } from './s3.provider';
import { S3Service } from './s3.service';

@Module({
  providers: [
    {
      provide: S3_PROVIDER_KEY,
      useClass: S3Service,
    },
  ],
  exports: [S3_PROVIDER_KEY],
})
export class S3Module {}

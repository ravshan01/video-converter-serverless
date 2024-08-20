import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvVariables } from '../../config/types/env-variables.type';

@Injectable()
export class S3Service {
  private client: S3Client;

  constructor(private readonly configService: ConfigService<EnvVariables>) {
    this.client = new S3Client({
      region: this.configService.get('YC_REGION'),
      credentials: {
        accessKeyId: this.configService.get('YC_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('YC_SECRET_ACCESS_KEY'),
      },
    });
  }

  getObject(bucketName: string, key: string) {
    return this.client.send(
      new GetObjectCommand({ Bucket: bucketName, Key: key }),
    );
  }

  putObject(bucketName: string, key: string, body: Uint8Array | Buffer) {
    return this.client.send(
      new PutObjectCommand({ Bucket: bucketName, Key: key, Body: body }),
    );
  }
}

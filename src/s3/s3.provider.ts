import {
  GetObjectCommandOutput,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';

export const S3_PROVIDER_KEY = 'S3_PROVIDER';

export interface IS3Provider {
  getObject(bucketName: string, key: string): Promise<GetObjectCommandOutput>;
  putObject(
    bucketName: string,
    key: string,
    body: Uint8Array | Buffer,
  ): Promise<PutObjectCommandOutput>;
}

import { Readable } from 'node:stream';

import { bufferToStream } from './buffer-to-stream.util';

describe('bufferToStream', () => {
  it('should convert Buffer to Readable stream', () => {
    const buffer = Buffer.from('Hello, world!');
    const stream = bufferToStream(buffer);
    expect(stream).toBeInstanceOf(Readable);
  });

  it('should emit correct data from the stream', (done) => {
    const buffer = Buffer.from('Hello, world!');
    const stream = bufferToStream(buffer);
    const chunks: Buffer[] = [];

    stream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    stream.on('end', () => {
      const result = Buffer.concat(chunks).toString();
      expect(result).toBe('Hello, world!');
      done();
    });
  });
});

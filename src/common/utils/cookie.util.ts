import * as crypto from 'crypto';

export const signCookie = (cookie: string, secret: string): string => {
  return (
    cookie +
    '.' +
    crypto
      .createHmac('sha256', secret)
      .update(cookie)
      .digest('base64')
      .replace(/\=+$/, '')
  );
};

export const verifyCookie = (input: string, secret: string): string => {
  const cookie = input.slice(0, input.lastIndexOf('.'));
  const signed = signCookie(cookie, secret);
  const signedBuffer = Buffer.from(signed);
  const inputBuffer = Buffer.from(input);

  if (
    signedBuffer.length === inputBuffer.length &&
    crypto.timingSafeEqual(signedBuffer, inputBuffer)
  ) {
    return cookie;
  }

  throw new Error('Invalid signature');
};

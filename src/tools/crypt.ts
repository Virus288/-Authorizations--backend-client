export const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest('SHA-256', data);
};

export const base64urlencoded = (a: ArrayBuffer): string => {
  let str = '';
  const bytes = new Uint8Array(a);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    str += String.fromCharCode(bytes[i] as number);
  }
  return btoa(str).replace(/\+/gu, '-').replace(/\//gu, '_').replace(/=+$/u, '');
};

export const generateCodeChallengeFromVerifier = async (val: string): Promise<string> => {
  const hashed = await sha256(val);
  return base64urlencoded(hashed);
};

const dec2hex = (dec: string): string => {
  return `0${dec.toString()}`.substring(-2);
};

export const generateCodeVerifier = (): string => {
  const array = new Uint32Array(56 / 2);
  crypto.getRandomValues(array);
  return Array.from(array as unknown as string[], dec2hex)
    .join('')
    .slice(0, 128);
};

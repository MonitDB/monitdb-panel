import * as crypto from 'node:crypto';

export function hashMD5(dados) {
  const md5Hash = crypto.createHash('md5');
  md5Hash.update(dados);
  return md5Hash.digest('hex');
}

export function encryptString(text) {
  const encrypted = crypto.createCipheriv(
    text,
    process.env.CIPHER_KEY,
    process.env.CIPHER_IV,
  );
  return encrypted.toString();
}

export function decryptString(ciphertext) {
  const decrypted = crypto.createDecipheriv(
    ciphertext,
    process.env.CIPHER_KEY,
    process.env.CIPHER_IV,
  );
  return decrypted.toString();
}

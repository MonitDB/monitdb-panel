/* eslint-disable unicorn/prefer-node-protocol */

import crypto from 'crypto';




export function hashMD5(dados) {
  const md5Hash = crypto.createHash('md5');
  md5Hash.update(dados);
  return md5Hash.digest('hex');
}

export async function encryptString(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const key = process.env.CIPHER_KEY;
  const iv = process.env.CIPHER_IV;


  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    data
  );

  return new Uint8Array(encrypted);
}

export async function decryptString(encryptedData) {
  const key = await importKey();

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: encryptedData.iv,
    },
    key,
    encryptedData.encryptedData
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

async function importKey() {
  return await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(process.env.CIPHER_KEY),
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

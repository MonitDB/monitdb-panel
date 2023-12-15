// Importa o módulo crypto
// eslint-disable-next-line unicorn/prefer-module
const crypto = require('crypto');

export function encryptString(text) {
  try {

    const cipher = crypto.createCipheriv('aes-256-cbc', process.env.cipherKey,  process.env.cipherIv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
  } catch  {
    return;
  }
}
export function decryptString(encrypted) {
  try {
    const decipher = crypto.createDecipherIv('aes-256-cbc', process.env.cipherKey, process.env.cipherIv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
      
  } catch {
    return;
  
  }
}


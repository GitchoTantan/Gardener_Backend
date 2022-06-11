const crypto = require('crypto');

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || 'abcdefghijklmnop'.repeat(2) 
const IV_LENGTH = 16 

module.exports.encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv,
  )
  const encrypted = cipher.update(text)

  return (
    iv.toString('hex') +
    ':' +
    Buffer.concat([encrypted, cipher.final()]).toString('hex')
  )
}

module.exports.decrypt = (text) => {
  const textParts = text.split(':')
  const iv = Buffer.from(textParts.shift(), 'hex')
  const encryptedText = Buffer.from(textParts.join(':'), 'hex')
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv,
  )
  const decrypted = decipher.update(encryptedText)

  return Buffer.concat([decrypted, decipher.final()]).toString()
}

/*
const text = 'hello my name is yceffort'
const encryptResult = encrypt(text)
console.log('encrypt result:', encryptResult)

const decryptResult = decrypt(encryptResult)
console.log('decrypt result:', decryptResult)
*/
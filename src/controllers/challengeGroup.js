const { encrypt, decrypt } = require('./crypto.js');

const encryptURL = async (req, res) => {
  const text = 'hello my name is yceffort'
  const encryptResult = encrypt(text)
  console.log('encrypt result:', encryptResult)
}

const decryptURL = async (req, res) => {
  const encryptResult = "7c51aa09dd8ba9dc470fc568a7ecf35c:25b4677fbd75cccd716b893089f25edd0b31cb7347f46272f96b4ad9ec636122"
  const decryptResult = decrypt(encryptResult)
  console.log('decrypt result:', decryptResult)
}

encryptURL()
decryptURL()

module.exports = { encryptURL, decryptURL }
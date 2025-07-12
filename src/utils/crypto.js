const forge = require('node-forge');

const signData = (data) => {
  const privateKey = forge.pki.privateKeyFromPem(process.env.PRIVATE_KEY_PEM);
  const md = forge.md.sha256.create();
  md.update(data, 'utf8');
  return forge.util.encode64(privateKey.sign(md));
};

const verifyData = (data, signature) => {
  const publicKey = forge.pki.publicKeyFromPem(process.env.PUBLIC_KEY_PEM);
  const md = forge.md.sha256.create();
  md.update(data, 'utf8');
  return publicKey.verify(md.digest().bytes(), forge.util.decode64(signature));
};

module.exports = { signData, verifyData };
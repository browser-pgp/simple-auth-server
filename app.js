// @ts-check

const fs = require('fs')
const openpgp = require('openpgp')

const getPrivKey = async () => {
  const privatekey = fs.readFileSync('keys/app.key')
  const {
    err,
    keys: [key],
  } = await openpgp.key.readArmored(privatekey)
  if (err?.length) {
    throw err[0]
  }
  await key.decrypt('test')
  return key
}

const getPubKey = async () => {
  const pubkey = fs.readFileSync('keys/app.pub')
  const {
    err,
    keys: [key],
  } = await openpgp.key.readArmored(pubkey)
  if (err?.length) {
    throw err[0]
  }
  return key
}

/**
 *
 * @param {string} ctx
 */
async function main(ctx) {
  const privKey = await getPrivKey()
  const pubkey = await getPubKey()
  let v = 'dddd'
  let { data } = await openpgp.encrypt({
    message: await openpgp.message.fromText(v),
    publicKeys: pubkey,
  })
  debugger
  let d = await openpgp.decrypt({
    message: await openpgp.message.readArmored(data),
    privateKeys: privKey,
  })
  debugger
  // const { data, signatures } = await openpgp.decrypt({
  //   message: await openpgp.message.readArmored(ctx),
  //   privateKeys: [privKey],
  // })
  // debugger
  // let text = await openpgp.cleartext.readArmored(data)
  // console.log(text)
  // debugger
}
let ctx = `
-----BEGIN PGP MESSAGE-----
Version: OpenPGP.js v4.10.1
Comment: https://openpgpjs.org

wV4DYfgisgpkP3sSAQdA4mM1/Qxn1b/M4/vebkD9622n71syF0o+hrzcjGNj
b2gw/Vk/9ZeVqNRjt6D5ArMuCxsxb4RXXf8IEb6hbU/m7cYHGVarnHb71rRJ
eTHGcXW/0sC+AcRT8wSRPvR6nY5cpSXGY6NkinOG39wKats45FjOuakpGXV+
Am9mxWQxkaHY91YfOtxd3qVO4ZJ3DEAooEgzYdto+3IMCGA+cxdRFM5Cay7R
SHg6trExL5FMFmMCIxgv6Z90Sf1Ekf5MibXZ+qeUd0P8msRE8aUaSAdoPaQn
lKmWWGXJTaQoFkoO8iOnJDnkKWkKkzQlU9wt2gaO4VeAXEUoxV8Prf0djJSQ
Y6/XceCdH1NNHfjum7BbouKYLhqc7pc2Ir1KLdQyYNCvN+eelQv1cRywt9FN
nKhtt/mvolscuRldkASr2QTmRnVh/U4+jK4GlkRlSO6ROuU21DToFVcXuZy5
1hbuwlyPU3JCItvsYOYSGuQhedwRjskX4KSdxR/IyMwqY3qp0ZGjsMNA17zE
0sf6d1KEknt7zBoTE10vMzeMZp+cfg/SdY6hwMtTafcUkDwaU6LQLKreeXuC
PqE4zwIKWhVmIPj3zG5KGGT/SILBhr8RL9mSBt8reA==
=cnHn
-----END PGP MESSAGE-----
`
main(ctx).catch((e) => {
  console.error(e)
  debugger
})

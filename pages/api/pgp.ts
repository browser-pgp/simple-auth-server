import * as fs from 'fs'
import * as openpgp from 'openpgp'

export const pubkey = fs.readFileSync('keys/app.pub')

export const getPubKey = async () => {
  const {
    err,
    keys: [key],
  } = await openpgp.key.readArmored(pubkey)
  if (err?.length) {
    throw err[0]
  }
  return key
}

const privatekey = fs.readFileSync('keys/app.key')
export const getPrivKey = async () => {
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

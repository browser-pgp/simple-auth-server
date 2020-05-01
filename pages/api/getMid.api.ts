import micro from 'micro'
import { NextApiResponse } from 'next'
import * as kvstore from './kvstore'
import { getPubKey } from './pgp'

const deferFingerprint = Promise.resolve().then(async () => {
  const pubkey = await getPubKey()
  return pubkey.getFingerprint()
})

export const getMid = async () => {
  let nowTime = ~~(Date.now() / 1e3)
  let mid = await kvstore.setValue(nowTime)
  return {
    mid,
    auth: process.env.Addr + '/api/auth',
    fingerprint: await deferFingerprint,
  }
}

export default micro(async (req, res: NextApiResponse) => {
  let data = await getMid()
  res.json(data)
})

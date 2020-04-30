import micro from 'micro'
import { NextApiResponse } from 'next'
import * as kvstore from './kvstore'
import { getPubKey } from './pgp'

export default micro(async (req, res: NextApiResponse) => {
  const pubkey = await getPubKey()
  let nowTime = ~~(Date.now() / 1e3)
  let mid = await kvstore.setValue(nowTime)
  let data = {
    mid,
    auth: process.env.Addr + '/api/auth',
    fingerprint: pubkey.getFingerprint(),
  }
  res.json(data)
})

import micro from 'micro'
import { NextApiResponse } from 'next'
import * as kvstore from './kvstore'

export default micro(async (req, res: NextApiResponse) => {
  let nowTime = ~~(Date.now() / 1e3)
  let mid = await kvstore.setValue(nowTime)
  let data = { mid, auth: 'http://127.0.0.1:3000/api/auth' }
  res.json(data)
})

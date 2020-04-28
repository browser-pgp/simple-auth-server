import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from './prisma'
import * as openpgp from 'openpgp'
import micro from 'micro'

interface Input {
  sign: string
  who: string
}

export default micro(async (req: NextApiRequest, res: NextApiResponse) => {
  let input = (req.query as any) as Input
  let user = await prisma.user.findOne({
    where: {
      name: input.who,
    },
  })
  if (user === null) {
    res.status(500).end('找不到用户')
    return
  }
  let {
    err,
    keys: [pubkey],
  } = await openpgp.key.readArmored(user.pubkey)
  if (err) {
    throw err[0]
  }
  let { data, signatures } = await openpgp.verify({
    message: await openpgp.cleartext.readArmored(input.sign),
    publicKeys: [pubkey],
  })
  let [sign] = signatures
  let verified = await sign.verified
  if (verified !== true) {
    res.end('签名有效, 但内容已损坏')
    return
  }
  let date = new Date(Number(data))
  let signTime = date.getTime()
  if (isNaN(signTime)) {
    res.end('签名内容需要是当前的时间戳')
    return
  }
  let d = Math.abs(signTime - Date.now())
  if (d > 30e3) {
    res.end('签名时间已超过 30s')
    return
  }
  res.end('认证通过')
})

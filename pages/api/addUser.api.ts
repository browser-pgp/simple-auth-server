import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from './prisma'
import micro from 'micro'
import * as openpgp from 'openpgp'

interface Body {
  pubkey: string
}

export default micro(async (req: NextApiRequest, res: NextApiResponse) => {
  let input = req.body as Body
  let {
    err,
    keys: [pubkey],
  } = await openpgp.key.readArmored(input.pubkey)
  if (err?.length) {
    res.status(400).json(`解析用户公钥失败, 错误原因: \r\n ${err[0].message}`)
    return
  }
  let name = (await pubkey.getPrimaryUser()).user.userId.userid
  let u = await prisma.user.create({
    data: {
      name: name,
      pubkey: input.pubkey,
      fingerprint: pubkey.getFingerprint(),
    },
  })
  res.json(u)
})

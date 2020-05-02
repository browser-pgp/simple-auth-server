import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from './prisma'
import * as openpgp from 'openpgp'
import micro from 'micro'
import { getPrivKey } from './pgp'
import * as kvstore from './kvstore'

interface Data {
  mid: string
  fingerprint: string
}

const getEncryptedMsg = async (ctx: string) => {
  let privKey = await getPrivKey()
  let { data } = await openpgp.decrypt({
    message: await openpgp.message.readArmored(ctx),
    privateKeys: [privKey],
  })
  let result = await openpgp.cleartext.readArmored(data)
  return result
}

export default micro(async (req: NextApiRequest, res: NextApiResponse) => {
  let ctx: string = req.query.content || req.body.content
  let msg = await getEncryptedMsg(ctx)
  const data: Data = JSON.parse(msg.getText())
  let createTime: number = await kvstore.getValue(data.mid)
  if (createTime === null) {
    res.status(400).end('mid 已过期')
    return
  }
  let nowTime = ~~(Date.now() / 1e3)
  if (Math.abs(nowTime - createTime) > 10 * 60) {
    res.status(403).end('mid 已超时')
    return
  }
  let users = await prisma.user.findMany({
    where: {
      fingerprint: data.fingerprint.toLowerCase(),
    },
  })
  if (users.length === 0) {
    res.status(400)
    res.setHeader('Content-Type', 'text/html')
    res.end('找不到用户 <a href="/addUser" >添加用户</a>')
    return
  }
  let pubkeys = await Promise.all(
    users.map(async (u) => {
      let {
        keys: [key],
      } = await openpgp.key.readArmored(u.pubkey)
      return key
    }),
  )
  let { signatures } = await openpgp.verify({
    message: msg,
    publicKeys: pubkeys,
  })
  let i = 0
  for (let sign of signatures) {
    if (await sign.verified) {
      break
    }
    i++
  }
  let user = users[i]
  if (typeof user === 'undefined') {
    res.status(400).end('签名无效')
    return
  }
  res.end(`认证通过. ${user.name}`)
})

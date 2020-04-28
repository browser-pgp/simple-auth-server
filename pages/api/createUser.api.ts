import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from './prisma'
import micro from 'micro'

interface Body {
  name: string
  pubkey: string
}

export default micro(async (req: NextApiRequest, res: NextApiResponse) => {
  let input = req.body as Body
  let u = await prisma.user.create({
    data: {
      name: input.name,
      pubkey: input.pubkey,
    },
  })
  res.json(u)
})

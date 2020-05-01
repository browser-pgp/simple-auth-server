import { prisma } from './prisma'
import micro from 'micro'
import { NextApiRequest, NextApiResponse } from 'next'

export default micro(async (req: NextApiRequest, res: NextApiResponse) => {
  let id = req.query.id as string
  await prisma.user.delete({
    where: {
      id: id,
    },
  })
  res.end(`user ${id} has been deleted`)
})

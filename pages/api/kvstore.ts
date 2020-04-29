import { prisma } from './prisma'

export const getValue = async (k: string) => {
  let kv = await prisma.authKV.findOne({
    where: {
      id: k,
    },
  })
  return kv?.value
}

export const setValue = async (value: number) => {
  let a = await prisma.authKV.create({
    data: {
      value: value,
    },
  })
  return a.id
}

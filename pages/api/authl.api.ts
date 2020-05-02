import { NextApiRequest, NextApiResponse } from 'next'
import micro from 'micro'

const buildFlush = (res: NextApiResponse) => {
  let compressed = res.hasHeader('Content-Encoding')
  return (...data: string[]) => {
    res.write(data.concat(['\n']).join('\n'))
    // @ts-ignore
    compressed && res.flush()
  }
}

const subs: { [k: string]: (content: string) => Promise<any> } = {}

export default micro(async (req: NextApiRequest, res: NextApiResponse) => {
  let mid = req.query.mid as string
  if (!mid) {
    res.status(400).end('数据格式不对')
    return
  }
  // should valite mid, but for test no check also is fine
  let cb = subs[mid]
  let content = req.body.content
  if (typeof content === 'string') {
    if (typeof cb !== 'function') {
      res.status(500).end('未知错误')
      return
    }
    await cb(content)
    res.status(200).end('登录已完成, 切回应用继续使用')
    return
  }
  function clear() {
    delete subs[mid]
  }
  res.writeHead(200, { 'Content-Type': 'text/event-stream' })
  res.on('close', clear)
  const write = buildFlush(res)
  write('event: ping', 'data: ping')
  subs[mid] = async (c) => {
    write('event: content', 'data: ' + JSON.stringify(c))
  }
})

import type { Data } from './index.page'

export const buildLink = (data: Data) => {
  let link = new URL('web+pgpauth:login')
  link.searchParams.set('auth', data.auth)
  link.searchParams.set('fingerprint', data.fingerprint)
  link.searchParams.set('mid', data.mid)
  return link.toString()
}

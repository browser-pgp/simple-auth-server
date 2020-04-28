import { Tabs, Tab } from '@material-ui/core'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const Header = () => {
  const router = useRouter()
  return (
    <Tabs
      value={router.pathname}
      onChange={(e, v) => router.push(v)}
      indicatorColor="primary"
    >
      <Tab label="登录验证" value="/" />
      <Tab label="创建用户" value="/createUser" />
    </Tabs>
  )
}

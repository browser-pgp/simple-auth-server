import {
  Button,
  TextField,
  Container,
  Grid,
  useTheme,
  Card,
  CardContent,
  CardActions,
  Link,
  ButtonGroup,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core'
import { Header } from './header'
import { NextPage } from 'next'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useMemo, Fragment } from 'react'

interface Data {
  mid: string
  auth: string
  fingerprint: string
}

const AuthPage: NextPage<{ data: Data; pubkey: string }> = ({
  data,
  pubkey,
}) => {
  const theme = useTheme()
  let link = useMemo(() => {
    let link = new URL('web+pgpauth:login')
    link.searchParams.set('auth', data.auth)
    link.searchParams.set('fingerprint', data.fingerprint)
    link.searchParams.set('mid', data.mid)
    return link.toString()
  }, [])
  const blink = useMemo(() => {
    let blink = new URL('https://browser-pgp.github.io/login.html')
    blink.searchParams.set('url', link)
    return blink.toString()
  }, [link])
  return (
    <Container maxWidth="md">
      <Header />
      <Card>
        <List>
          <ListItem>
            <ListItemText
              primary="网站应用公钥"
              secondary={
                <Fragment>
                  <pre>
                    <code>{pubkey}</code>
                  </pre>
                  <CopyToClipboard
                    text={pubkey}
                    onCopy={() => alert('复制成功')}
                  >
                    <Button variant="outlined">点击复制网站应用公钥</Button>
                  </CopyToClipboard>
                </Fragment>
              }
            />
          </ListItem>
          <Link href={link}>
            <ListItem button>
              <ListItemText
                primary="web+pgpauth 协议登录"
                secondary={<code>{decodeURIComponent(link)}</code>}
              />
            </ListItem>
          </Link>
          <Link href={blink}>
            <ListItem button>
              <ListItemText
                primary="普通链接登录"
                secondary={
                  <code>{decodeURIComponent(decodeURIComponent(blink))}</code>
                }
              />
            </ListItem>
          </Link>
        </List>
      </Card>
    </Container>
  )
}

import { getMid } from './api/getMid.api'
import * as fs from 'fs'

export async function getServerSideProps() {
  let data = await getMid()
  const pubkey = fs.readFileSync('keys/app.pub', 'utf8')
  return { props: { data, pubkey } }
}

export default AuthPage

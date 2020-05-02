import {
  Button,
  Container,
  useTheme,
  Card,
  CardContent,
  CardHeader,
  Link,
  ButtonGroup,
  Paper,
  Tooltip,
  IconButton,
  Collapse,
  Divider,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import { useSnackbar } from 'notistack'

import { Header } from '../header'
import { NextPage } from 'next'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useMemo, useState } from 'react'

export interface Data {
  mid: string
  auth: string
  fingerprint: string
}

import { FullLogin } from './FullLogin'

const AuthPage: NextPage<{ data: Data; pubkey: string }> = ({
  data,
  pubkey,
}) => {
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()
  const [showPubkey, setShowPubkey] = useState(false)

  let actions = (
    <ButtonGroup size="small" style={{ marginTop: theme.spacing(1) }}>
      <Button
        startIcon={<VpnKeyIcon />}
        onClick={() => setShowPubkey(!showPubkey)}
      >
        {showPubkey ? '隐藏' : '显示'}网站公钥
      </Button>
      <CopyToClipboard text={pubkey} onCopy={() => enqueueSnackbar('复制成功')}>
        <Button startIcon={<FileCopyIcon />}>复制公钥</Button>
      </CopyToClipboard>
    </ButtonGroup>
  )
  return (
    <Container maxWidth="md">
      <Header />
      <Paper style={{ paddingBottom: 30, paddingTop: 30 }}>
        <Container maxWidth="sm">
          <Card>
            <CardHeader
              title="登录"
              subheader={actions}
              action={
                <Tooltip
                  title={showPubkey ? '点击隐藏网站公钥' : '点击显示网站公钥'}
                  onClick={() => setShowPubkey(!showPubkey)}
                >
                  <IconButton>
                    {showPubkey ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Tooltip>
              }
            />
            <Divider />
            <Collapse in={showPubkey}>
              <CardContent>
                <code
                  style={{
                    whiteSpace: 'pre',
                    display: 'block',
                  }}
                >
                  {pubkey}
                </code>
              </CardContent>
              <Divider />
            </Collapse>
            <FullLogin data={data} />
          </Card>
        </Container>
      </Paper>
    </Container>
  )
}

import { getMid } from '../api/getMid.api'
import * as fs from 'fs'

export async function getServerSideProps() {
  let data = await getMid()
  const pubkey = fs.readFileSync('keys/app.pub', 'utf8')
  return { props: { data, pubkey } }
}

export default AuthPage

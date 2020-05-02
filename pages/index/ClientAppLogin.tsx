import { useSnackbar } from 'notistack'
import {
  List,
  Tooltip,
  ListItem,
  ListItemText,
  Typography,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core'
import CopyToClipboard from 'react-copy-to-clipboard'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import QRCode from 'qrcode.react'
import { useTheme } from '@material-ui/core'
import { useEffect, useMemo, Fragment, useState, useRef } from 'react'
import type { Data } from './index.page'
import { buildLink } from './utils'

const api = '/api/authl'

const FormLogin = ({ data }: { data: Data }) => {
  const [content, setContent] = useState('')
  const form = useRef<HTMLFormElement>()
  useEffect(() => {
    if (!form) {
      return
    }
    let e = new EventSource(`${api}?mid=${data.mid}`)
    e.addEventListener('content', async (e: any) => {
      let c = JSON.parse(e.data)
      setContent(c)
      await new Promise((rl) => setContent((c) => (rl(), c)))
      form.current.submit()
    })
    return () => {
      e.close()
    }
  }, [form.current, data.mid])
  return (
    <form ref={form} action={data.auth} method="POST">
      <input type="hidden" name="content" value={content} />
    </form>
  )
}

export const ClientAppLogin = ({ data }: { data: Data }) => {
  const { enqueueSnackbar } = useSnackbar()
  let link = useMemo(() => {
    let u = new URL(api, process.env.Addr || location.origin)
    u.searchParams.set('mid', data.mid)
    return buildLink({
      ...data,
      auth: u.toString(),
    })
  }, [data.mid])
  const theme = useTheme()

  return (
    <Fragment>
      <FormLogin data={data} />
      <List>
        <Tooltip title="点击复制登录链接">
          <CopyToClipboard
            text={link}
            onCopy={() => enqueueSnackbar('复制成功')}
          >
            <ListItem button divider>
              <ListItemText
                primary="复制链接登录"
                secondary={
                  <Typography
                    style={{
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {link}
                  </Typography>
                }
              />
              <ListItemSecondaryAction>
                <IconButton>
                  <FileCopyIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </CopyToClipboard>
        </Tooltip>
        <ListItem>
          <ListItemText
            primary="二维码登录"
            secondary={
              <Typography style={{ paddingTop: theme.spacing(1) }}>
                <QRCode value={link} size={300} renderAs="svg" />
              </Typography>
            }
          />
        </ListItem>
      </List>
    </Fragment>
  )
}

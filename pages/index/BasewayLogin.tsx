import type { Data } from './index.page'
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Button,
  IconButton,
  Collapse,
  Divider,
  Typography,
} from '@material-ui/core'
import CopyToClipboard from 'react-copy-to-clipboard'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useSnackbar } from 'notistack'
import { useMemo, useState, Fragment } from 'react'

const saveShowTutorialSelectedKey = 'save-show-tutorial-selected-key'
const Tutorial = () => {
  const initShowTutorial = useMemo(() => {
    let v = localStorage.getItem(saveShowTutorialSelectedKey)
    return v !== '0'
  }, [])
  const [showTutorial, setShowTutorial] = useState(initShowTutorial)
  const toggleShowTutorial = () => {
    let s = !showTutorial
    setShowTutorial(s)
    localStorage.setItem(saveShowTutorialSelectedKey, s ? '1' : '0')
  }
  return (
    <Fragment>
      <ListItem button onClick={toggleShowTutorial}>
        <ListItemText primary="步骤介绍" />
        <ListItemSecondaryAction>
          <IconButton onClick={toggleShowTutorial}>
            {showTutorial ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={showTutorial}>
        <ListItem>
          <Typography>
            1. 复制上方的 JSON 字符串 <br />
            2. 将 <code>fingerprint</code> 替换成登录的帐号的,
            然后对替换后的内容进行签名
            <br />
            3. 之后使用本站公钥进行加密 <br />
            4. 把加密后的内容粘贴到下方输入框中 <br />
            5. 点击最下方的 "提交" 按钮进行登录
          </Typography>
        </ListItem>
      </Collapse>
    </Fragment>
  )
}

const saveTmpFingerprintKey = 'save-tmp-fingerprint-key'
export const BasewayLogin = ({ data }: { data: Data }) => {
  const { enqueueSnackbar } = useSnackbar()
  const initFingerprint = useMemo(() => {
    return (
      localStorage.getItem(saveTmpFingerprintKey) ||
      'repalce_your_key_fingerprint_here'
    )
  }, [])
  const [fingerprint, setFingerprint] = useState(initFingerprint)

  const v = JSON.stringify(
    {
      mid: data.mid,
      auth: data.auth,
      fingerprint,
    },
    null,
    2,
  )

  return (
    <form action={data.auth} method="POST">
      <List>
        <ListItem style={{ paddingBottom: 0 }}>
          <TextField
            fullWidth
            label="指纹(fingerprint)"
            size="small"
            value={fingerprint}
            onChange={(e) => {
              let v = e.target.value
              setFingerprint(v.replace(/\W/g, ''))
              localStorage.setItem(saveTmpFingerprintKey, v)
            }}
            helperText="登录帐号公钥的指纹(fingerprint)"
          />
        </ListItem>
        <ListItem>
          <ListItemText>
            <code style={{ whiteSpace: 'pre' }}>{v}</code>
          </ListItemText>
          <ListItemSecondaryAction>
            <CopyToClipboard
              text={v}
              onCopy={() => enqueueSnackbar('复制成功')}
            >
              <IconButton>
                <FileCopyIcon />
              </IconButton>
            </CopyToClipboard>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <Tutorial />
        <ListItem>
          <TextField
            name="content"
            fullWidth
            variant="outlined"
            multiline
            rows={10}
            label="加密签名"
            required
          />
        </ListItem>
        <ListItem>
          <Button
            size="large"
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
          >
            提交
          </Button>
        </ListItem>
      </List>
    </form>
  )
}

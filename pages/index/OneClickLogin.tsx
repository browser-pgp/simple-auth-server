import { CardContent, Link, Button } from '@material-ui/core'
import { useTheme } from '@material-ui/core'
import { Data } from './index.page'
import { useMemo } from 'react'
import { buildLink } from './utils'

export const OneClickLogin = ({
  data,
  fallback,
}: {
  data: Data
  fallback: () => any
}) => {
  const theme = useTheme()
  let link = useMemo(() => buildLink(data), [data.mid])

  return (
    <div style={{ textAlign: 'center' }}>
      <Button
        size="large"
        color="primary"
        variant="contained"
        component={'a'}
        href={link}
        // 如果 1s 后还在这个页面的话说明你没有跳到其他页面登录, 显示备用方案
        onClick={() => setTimeout(fallback, 1e3)}
        style={{
          margin: theme.spacing(3, 0),
          padding: theme.spacing(2, 5),
        }}
      >
        点击使用 PGP Auth 登录
      </Button>
    </div>
  )
}

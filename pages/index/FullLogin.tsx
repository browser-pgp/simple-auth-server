import { Data } from './index.page'
import { useState, useMemo, Fragment } from 'react'
import { CardContent, Tabs, Tab, Collapse, Tooltip } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'

import { ClientAppLogin } from './ClientAppLogin'
import { BasewayLogin } from './BasewayLogin'
import { OneClickLogin } from './OneClickLogin'

enum LoginWay {
  ClientApp = 'ClientApp',
  Base = 'Base',
  OneClick = 'OneClick',
}

const LastSelectedWayKey = 'last-selected-login-way'
const getDefualtWay = () => {
  if (!process.browser) {
    return LoginWay.ClientApp
  }
  return localStorage.getItem(LastSelectedWayKey) || LoginWay.OneClick
}

export const FullLogin = ({ data }: { data: Data }) => {
  const [showAlert, setShowAlert] = useState(false)
  const lastSelectedWay = useMemo(getDefualtWay, [])
  const [tab, setTab] = useState(lastSelectedWay)
  const selecteTab = (v: any, store = true) => {
    setTab(v)
    if (store) {
      localStorage.setItem(LastSelectedWayKey, v)
    }
  }
  const fallback = () => {
    let fallbackWay = getDefualtWay()
    if (fallbackWay === LoginWay.OneClick) {
      fallbackWay = LoginWay.ClientApp
    }
    selecteTab(fallbackWay, false)
  }
  let body: JSX.Element
  switch (tab) {
    case LoginWay.ClientApp:
      body = <ClientAppLogin data={data} />
      break
    case LoginWay.Base:
      body = <BasewayLogin data={data} />
      break
    case LoginWay.OneClick:
      body = <OneClickLogin data={data} fallback={fallback} />
  }
  return (
    <Fragment>
      <Tabs
        value={tab}
        onChange={(e, v) => selecteTab(v)}
        indicatorColor="primary"
      >
        <Tab label="一键登录" value={LoginWay.OneClick} />
        <Tab label="客户端登录" value={LoginWay.ClientApp} />
        <Tab label="手动登录" value={LoginWay.Base} />
      </Tabs>
      <Collapse in={showAlert}>
        <Tooltip title="点击隐藏警告">
          <Alert severity="info" onClick={() => setShowAlert(false)}>
            <AlertTitle>PGP Auth 协议登录失败, 使用备选登录方案</AlertTitle>
            失败原因有:
            <br />
            1. 你尚未设置 <code>web+pgpauth</code> 支持的客户端
            <br />
            2. 手机端不支持 <code>web+pgpauth</code> 协议
            <br />
          </Alert>
        </Tooltip>
      </Collapse>
      <CardContent>{body}</CardContent>
    </Fragment>
  )
}

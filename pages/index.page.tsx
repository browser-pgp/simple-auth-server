import {
  Button,
  TextField,
  Container,
  Grid,
  useTheme,
  Card,
  CardContent,
} from '@material-ui/core'
import { Header } from './header'
import { NextPage } from 'next'

interface Data {
  mid: string
  auth: string
}

const AuthPage: NextPage<{ data: Data }> = ({ data }) => {
  const theme = useTheme()
  return (
    <Container maxWidth="md">
      <Header />
      <Card>
        <form action={data.auth} method="POST">
          <CardContent>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <TextField
                  label="要签名的内容"
                  fullWidth
                  variant="outlined"
                  value={JSON.stringify({ mid: data.mid, fingerprint: '' })}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="签名"
                  name="context"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows="10"
                />
              </Grid>
              <Grid item>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  登录验证
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </form>
      </Card>
    </Container>
  )
}

import fetch from 'node-fetch'

AuthPage.getInitialProps = async () => {
  let data = await fetch('http://127.0.0.1:3000/api/getMid').then((res) =>
    res.json(),
  )
  return { data: data }
}

export default AuthPage

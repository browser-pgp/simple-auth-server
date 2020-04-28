import {
  Button,
  TextField,
  Container,
  Paper,
  Grid,
  useTheme,
  Card,
  CardContent,
} from '@material-ui/core'
import { Header } from './header'

export default () => {
  const theme = useTheme()
  return (
    <Container maxWidth="md">
      <Header />
      <Card>
        <form action="/api/auth" method="GET">
          <CardContent>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <TextField
                  label="登录"
                  name="who"
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item>
                <TextField
                  label="签名"
                  name="sign"
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

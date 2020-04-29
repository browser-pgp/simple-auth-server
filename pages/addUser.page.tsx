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

export default () => {
  const theme = useTheme()
  return (
    <Container maxWidth="md">
      <Header />
      <Card>
        <form action="/api/addUser" method="POST">
          <CardContent>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <TextField
                  label="公钥"
                  name="pubkey"
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
                  添加用户
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </form>
      </Card>
    </Container>
  )
}

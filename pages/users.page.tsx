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
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import { Header } from './header'
import { NextPage } from 'next'
import { User } from '@prisma/client'
import { useRouter } from 'next/router'

const UsersPage: NextPage<{ users: User[] }> = ({ users }) => {
  const router = useRouter()
  const delUser = async (id: string) => {
    await fetch('/api/delUser?id=' + id)
    router.reload()
  }
  return (
    <Container maxWidth="md">
      <Header />
      <Paper>
        <List>
          {users.map((u) => (
            <ListItem key={u.id} divider>
              <ListItemText
                primary={u.name}
                secondary={u.fingerprint.toUpperCase()}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => delUser(u.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  )
}

import { prisma } from './api/prisma'

export async function getServerSideProps() {
  // const { prisma } = await import('./api/prisma')
  let users = await prisma.user.findMany()
  return { props: { users } }
}

export default UsersPage

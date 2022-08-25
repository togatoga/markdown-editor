import MyEditor from '../components/editor';
import Login from '../components/user/login';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { AppBar, Box, Grid, Toolbar, Typography } from '@mui/material';
import { Container } from '@mui/material';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <>
      <AppBar position='static' color='secondary'>
        <Container maxWidth='lg'>
          <Toolbar>
            <Grid container spacing={24} justifyContent='space-between'>
              <Grid item>
                <Box display='flex' flexDirection='row'>
                  <TextFieldsIcon sx={{ mr: 2 }} />
                  <Typography variant='h6'>Markdown Editor</Typography>
                </Box>
              </Grid>
              <Grid item>
                <Login />
              </Grid>
            </Grid>
          </Toolbar>
        </Container>
      </AppBar>
      <MyEditor />
    </>
  );
};

export default Home;

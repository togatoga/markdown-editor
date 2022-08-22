import MyEditor from '../components/editor';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Container } from '@mui/system';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <>
      <AppBar position='static'>
        <Container maxWidth='md'>
          <Toolbar>
            <TextFieldsIcon sx={{ mr: 2 }} />
            <Typography variant='h6'>Markdown Editor</Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <MyEditor />
    </>
  );
};

export default Home;

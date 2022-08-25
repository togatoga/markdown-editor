import Logout from '@mui/icons-material/Logout';
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Login() {
  const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      {!session && (
        <>
          <Button
            variant='contained'
            style={{ textTransform: 'none' }}
            onClick={(e) => {
              e.preventDefault();
              signIn();
            }}
          >
            Login
          </Button>
        </>
      )}
      {status === 'authenticated' && (
        <>
          <IconButton
            onClick={handleClick}
            size='small'
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar
              alt={session.user?.name ?? ''}
              src={session.user?.image ?? ''}
            />
          </IconButton>
          <Menu
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            onClick={handleClose}
          >
            <MenuItem>{session.user?.name ?? ''}</MenuItem>
            <Divider />
            <MenuItem>
              <IconButton size='small' onClick={() => signOut()}>
                <ListItemIcon>
                  <Logout fontSize='small' />
                </ListItemIcon>
                <Typography>Logout</Typography>
              </IconButton>
            </MenuItem>
          </Menu>
        </>
      )}
    </>
  );
}

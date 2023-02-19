import { Box, Drawer } from '@mui/material';
import useWindowSize from '../../../hooks/useWindowSize';
import MenuList from './Menu/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const MainSidebar = ({ open, handleMenu }) => {
  const { width } = useWindowSize();
  const matchUpMd = width >= 900;
  const container =
    typeof window !== 'undefined' ? () => window.document.body : undefined;

  return (
    <Box
      component="nav"
      sx={{ flexShrink: { md: 0 }, width: 'auto' }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant="temporary"
        anchor="right"
        open={open}
        onClose={handleMenu}
        sx={{
          '& .MuiDrawer-paper': {
            width: 300,
            background: 'var(--bgColor)',
            borderRight: 'none',
            borderLeft: 'none',
          },
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            p: '15px 22px',
          }}
        >
          <IconButton
            disableRipple
            onClick={handleMenu}
            sx={{
              backgroundColor: 'var(--lightGrey)',
              width: 45,
              height: 45,
              borderRadius: '10px',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <MenuList />
      </Drawer>
    </Box>
  );
};

export default MainSidebar;

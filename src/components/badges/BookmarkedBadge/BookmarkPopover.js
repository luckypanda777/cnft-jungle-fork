import { Popover, Box, Divider, capitalize } from '@mui/material';
import { Context as AuthContext } from 'context/AuthContext';
import { useContext } from 'react';

export const initialAnchorOrigin = {
  vertical: 'bottom',
  horizontal: 'left',
};

export const initialTransformOrigin = {
  vertical: 'top',
  horizontal: 'left',
};

const BookmarkPopover = ({
  anchor,
  open,
  handleClose,
  handleOpen,
  anchorOrigin = initialAnchorOrigin,
  transformOrigin = initialTransformOrigin,
  handleClick,
  target,
}) => {
  const {
    state: { user },
  } = useContext(AuthContext);

  const names = user.watchlistNames?.map((w) => {
    const exists = user.watchlist.some(
      (watch) =>
        watch.identifier === target.identifier &&
        watch.kind === target.kind &&
        watch.watchlistName === w
    );

    if (exists) {
      return { action: 'remove from', name: w };
    }

    return { action: 'add to', name: w };
  });

  return (
    <Popover
      sx={{ pointerEvents: 'none' }}
      open={open}
      anchorEl={anchor.current}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      onClose={handleClose}
      PaperProps={{
        onMouseEnter: handleOpen,
        onMouseLeave: handleClose,
        sx: {
          borderRadius: '10px',
          pointerEvents: 'auto',
        },
      }}
      disableRestoreFocus
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: '200px',
          width: '100%',
          maxHeight: '200px',
          overflowY: 'auto',
        }}
      >
        {names?.map(({ name, action }, index) => (
          <>
            <Box
              key={name}
              onClick={() => handleClick({ watchlistName: name })}
              sx={{
                p: 2,
                cursor: 'pointer',
                '&:hover': { color: 'var(--logoColor)' },
              }}
            >
              {capitalize(action)} {name || `Watchlist ${index + 1}`}
            </Box>
            {names.length - 1 !== index && (
              <Divider sx={{ width: '95%', mx: 'auto' }} />
            )}
          </>
        ))}
      </Box>
    </Popover>
  );
};

export default BookmarkPopover;

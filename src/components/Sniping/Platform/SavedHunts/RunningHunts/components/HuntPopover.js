import { Popover, Box, Divider, capitalize } from '@mui/material';
import { useAppContext } from 'context/AppContext';
import { Context as AuthContext } from 'context/AuthContext';
import { Context as SearchContext } from 'context/SearchContext';
import { useContext } from 'react';

export const initialAnchorOrigin = {
  vertical: 'bottom',
  horizontal: 'left',
};

export const initialTransformOrigin = {
  vertical: 'top',
  horizontal: 'left',
};

const HuntPopover = ({
  anchor,
  open,
  handleClose,
  handleOpen,
  anchorOrigin = initialAnchorOrigin,
  transformOrigin = initialTransformOrigin,
  handleClick,
  hunt,
}) => {
  const {
    state: { user },
  } = useContext(AuthContext);
  const {
    state: { huntList },
  } = useContext(SearchContext);

  const names = user.huntlistNames
    ?.filter((w) => w !== hunt.huntlistName)
    .map((w) => {
      return { action: 'move to', name: w };
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
          backgroundColor: 'var(--paperColor)',
          backgroundImage: 'none',
        },
      }}
      disableRestoreFocus
    >
      {hunt.huntlistName && (
        <>
          <Box
            key={name}
            onClick={() => handleClick({ huntlistName: '' })}
            sx={{
              p: 2,
              cursor: 'pointer',
              '&:hover': { color: 'var(--logoColor)' },
            }}
          >
            Remove from {hunt.huntlistName}
          </Box>
          <Divider
            sx={{
              width: '95%',
              mx: 'auto',
              backgroundColor: 'var(--fontColor)',
            }}
          />
        </>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: '200px',
          width: '100%',
          maxHeight: '200px',
          overflowY: 'auto',
          color: 'var(--fontColor)',
        }}
      >
        {names?.map(({ name, action }, index) => (
          <>
            <Box
              key={name}
              onClick={() => handleClick({ huntlistName: name })}
              sx={{
                p: 2,
                cursor: 'pointer',
                '&:hover': { color: 'var(--logoColor)' },
              }}
            >
              {capitalize(action)} {name || `Hunts ${index + 1}`}
            </Box>
            {index !== names.length - 1 && (
              <Divider
                sx={{
                  width: '95%',
                  mx: 'auto',
                  backgroundColor: 'var(--fontColor)',
                }}
              />
            )}
          </>
        ))}
      </Box>
    </Popover>
  );
};

export default HuntPopover;

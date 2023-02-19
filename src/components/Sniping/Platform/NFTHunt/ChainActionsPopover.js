import { Popover, Box, Divider, capitalize, IconButton } from '@mui/material';
import CustomTooltip from 'components/common/CustomTooltip';
import { useContext } from 'react';
import { Context as AuthContext } from 'context/AuthContext';
import Input from 'components/common/Input';
import { useState } from 'react';
import { rules, rulesLogic, ruleMapping } from './hunt-rules';

export const initialAnchorOrigin = {
  vertical: 'bottom',
  horizontal: 'left',
};

export const initialTransformOrigin = {
  vertical: 'top',
  horizontal: 'left',
};

const ChainActionsPopover = ({
  anchor,
  open,
  handleClose,
  handleOpen,
  anchorOrigin = initialAnchorOrigin,
  transformOrigin = initialTransformOrigin,
  handleClick,
  chainEvents = [],
  showAllRules,
  huntType = 'hunt',
  actionType,
}) => {
  const [filter, setFilter] = useState();
  const {
    state: { user },
  } = useContext(AuthContext);

  const shownRules = rules.filter(
    (rule) =>
      !filter ||
      rule.name
        .replace(/[^a-zA-Z ]/g, '')
        .toLowerCase()
        .includes(filter.toLowerCase())
  );

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
      <Input
        sx={{ p: 1 }}
        autoFocus
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search rule"
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: '150px',
          width: '100%',
          maxHeight: '350px',
          overflowY: 'auto',
        }}
      >
        {shownRules.map((rule, index) => {
          const hasPermissions =
            ruleMapping[rule.permissions].includes(user?.snipeTier) ||
            showAllRules;

          if (!hasPermissions) {
            return (
              <>
                <CustomTooltip
                  title={`Only available for ${rule.permissions} tier!`}
                  placement="right"
                >
                  <Box
                    key={rule.label}
                    sx={{
                      cursor: 'not-allowed',
                      p: 2,
                      color: 'var(--rankGrey)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {rule.name}
                  </Box>
                </CustomTooltip>
                {shownRules.length - 1 !== index && (
                  <Divider sx={{ width: '95%', mx: 'auto' }} />
                )}
              </>
            );
          }

          return (
            <>
              <Box
                key={rule.label}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  color: rule.disabled ? 'var(--rankGrey)' : 'var(--fontColor)',
                  '&:hover': { color: 'var(--logoColor)' },
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={() => handleClick({ ...rule, actionType })}
              >
                {rule.name}
                <CustomTooltip title={rule.description} placement="right" />
              </Box>
              {shownRules.length - 1 !== index && (
                <Divider sx={{ width: '95%', mx: 'auto' }} />
              )}
            </>
          );
        })}
      </Box>
    </Popover>
  );
};

export default ChainActionsPopover;

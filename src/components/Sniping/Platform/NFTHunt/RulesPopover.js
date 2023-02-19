import { Popover, Box, Divider, capitalize, IconButton } from '@mui/material';
import { rules, ruleMapping } from './hunt-rules';
import CustomTooltip from 'components/common/CustomTooltip';
import { useContext } from 'react';
import { Context as AuthContext } from 'context/AuthContext';
import Input from 'components/common/Input';
import { useState } from 'react';

export const initialAnchorOrigin = {
  vertical: 'bottom',
  horizontal: 'left',
};

export const initialTransformOrigin = {
  vertical: 'top',
  horizontal: 'left',
};

const RulesPopover = ({
  anchor,
  open,
  handleClose,
  handleOpen,
  anchorOrigin = initialAnchorOrigin,
  transformOrigin = initialTransformOrigin,
  handleClick,
  selectedRules = [],
  showAllRules,
  huntType = 'hunt',
}) => {
  const [filter, setFilter] = useState();
  const {
    state: { user },
  } = useContext(AuthContext);

  const shownRules = rules
    .filter((rule) => rule.huntType.includes(huntType))
    .filter(
      (rule) =>
        !filter ||
        rule.name
          .replace(/[^a-zA-Z ]/g, '')
          .toLowerCase()
          .includes(filter.toLowerCase())
    )
    .filter((rule) => !selectedRules.find((r) => r.label === rule.label));

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
                onClick={() => handleClick(rule)}
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

export default RulesPopover;

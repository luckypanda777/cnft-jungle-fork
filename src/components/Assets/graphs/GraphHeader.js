import { Box, FormControl } from '@mui/material';
import PredatorSwitch from './PredatorSwitch';
import CustomTooltip from 'components/common/CustomTooltip';

const GraphHeader = ({
  title,
  showSwitch,
  checked,
  onSwitchChange,
  tooltipText,
  switchTitle,
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        '@media screen and (max-width: 1000px)': {
          flexDirection: 'column',
          pt: 2,
        },
      }}
    >
      <span
        style={{
          color: 'var(--fontColor)',
          fontSize: 18,
          fontWeight: 'bold',
        }}
      >
        {title}
      </span>{' '}
      <FormControl
        variant="standard"
        sx={{
          minWidth: 50,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          '&:focus': { background: 'transparent' },
        }}
      >
        {showSwitch && (
          <PredatorSwitch
            checked={checked}
            onChange={onSwitchChange}
            name={switchTitle}
          />
        )}
        {tooltipText && <CustomTooltip title={tooltipText} placement="top" />}
      </FormControl>
    </Box>
  );
};

export default GraphHeader;

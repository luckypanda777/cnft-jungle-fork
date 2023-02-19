import { Box, IconButton, styled, Tooltip } from '@mui/material';
import HelpIcon from 'assets/icons/infotooltip.svg';

const ToBeStyledTooltip = ({ className, ...props }) => (
  <Tooltip {...props} classes={{ tooltip: className }} />
);
const StyledTooltip = styled(ToBeStyledTooltip)(({ theme }) => ({
  backgroundColor: 'var(--bgColor)',
  color: 'var(--fontColor)',
  border: '1px solid #dadde9',
  fontFamily: 'newgilroymedium',
  fontSize: 16,
  borderRadius: 6,
}));

const InfoTooltip = ({ title, placement, children, onClick, style }) => {
  return (
    <StyledTooltip title={title} placement={placement}>
      <span
        style={{
          marginLeft: 5,
          paddingTop: 3,
          cursor: onClick ? 'pointer' : 'help',
          ...style,
        }}
        onClick={onClick && onClick}
      >
        {children || <HelpIcon width={18} height={18} />}
      </span>
    </StyledTooltip>
  );
};

export default InfoTooltip;

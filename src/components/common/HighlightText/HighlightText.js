import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import { CircularProgress, Tooltip } from '@mui/material';
import CustomTooltip from 'components/common/CustomTooltip';

const HighlightText = ({
  prefix = '',
  postfix = '',
  highlight,
  defaultHighlight,
  text,
  tooltipText,
  defaultText,
  loading,
  spinnerStyle = { color: 'var(--logoColor)', width: 25 },
  highlightStyle = {
    color: 'var(--logoColor)',
    width: 25,
  },
  textStyle = { fontWeight: 'bold' },
}) => {
  return tooltipText ? (
    <CustomTooltip title={tooltipText}>
      <span style={textStyle}>
        <span style={highlightStyle}>
          {loading ? (
            <CircularProgress size={15} sx={spinnerStyle} />
          ) : (
            prefix + (highlight || defaultHighlight) + postfix
          )}
        </span>{' '}
        {text || defaultText}
      </span>
    </CustomTooltip>
  ) : (
    <span style={textStyle}>
      <span style={highlightStyle}>
        {loading ? (
          <CircularProgress size={15} sx={spinnerStyle} />
        ) : (
          prefix + (highlight || defaultHighlight) + postfix
        )}
      </span>{' '}
      {text || defaultText}
    </span>
  );
};

export default HighlightText;

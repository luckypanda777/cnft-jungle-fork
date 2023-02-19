import { ListItemText, CircularProgress } from '@mui/material';
import HighlightText from '../common/HighlightText';

const DefaultListItemText = ({
  loading,
  prefix = '',
  postfix = '',
  defaultValue = '',
  value,
  style,
  textAlign = 'right',
  textStyle = {},
  highlight = false,
}) => {
  return (
    <ListItemText
      sx={style}
      primary={
        <HighlightText
          highlightStyle={{
            color: highlight && 'var(--logoColor)',
            fontWeight: highlight && 'bold',
          }}
          loading={loading}
          highlight={value}
          defaultHighlight={defaultValue}
          text={postfix}
          prefix={prefix}
        />
      }
      primaryTypographyProps={{
        fontSize: 14,
        color: 'var(--fontColor)',
        textAlign,
        ...textStyle,
      }}
    />
  );
};

export default DefaultListItemText;

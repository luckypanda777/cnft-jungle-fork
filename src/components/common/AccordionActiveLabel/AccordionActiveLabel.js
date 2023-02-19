import { Chip, Box, Typography } from '@mui/material';

const AccordionActiveLabel = ({
  condition,
  label,
  chip,
  size = 'small',
  sx = {
    ml: 1,
    fontSize: 10,
    fontWeight: 'bold',
    height: 22,
  },
  fontSize = 14,
  variant = 'outlined',
  error,
  icon,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {icon}
      <span
        style={{ fontSize, paddingTop: 3, fontFamily: 'newgilroysemibold' }}
      >
        {label}
      </span>
      {condition && (
        <Chip
          label={chip}
          size={size}
          color={error ? 'warning' : 'primary'}
          variant={variant}
          sx={sx}
        />
      )}
    </Box>
  );
};

export default AccordionActiveLabel;

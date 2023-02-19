import { default as MuiSelect } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import InputBase from '@mui/material/InputBase';

const Input = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    borderRadius: 10,
    border: 'solid 2px',
    borderColor: 'var(--selectBorder)',
    position: 'relative',
    backgroundColor: 'var(--selectBg)',
    fontSize: 12,
    fontWeight: 700,
    height: 'unset',
    minHeight: '14px !important',
    lineHeight: '14px',
    color: 'var(--selectColor)',
    padding: '8px 24px 8px 15px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    paddingRight: '28px !important',

    '&:focus': {
      borderRadius: 10,
      borderColor: 'var(--primaryColor)',
    },
  },
  '& .MuiSvgIcon-root': {
    right: 4,
  },
}));

const Select = ({
  options = [],
  placeholder = '',
  label = undefined,
  style,
  ...rest
}) => {
  const id = `${rest?.name}${Math.floor(Math.random() * 1000)}`;

  if (placeholder && placeholder.length > 0) {
    rest.renderValue = (value) => {
      if (!value) {
        return <span style={{ color: 'var(--notFound)' }}>{placeholder}</span>;
      }

      const optLabel = options.find(
        (el) => el.value.toString() === value.toString()
      );

      return optLabel?.label;
    };
  }

  return (
    <FormControl variant="standard" sx={style}>
      {label && (
        <FormHelperText
          sx={{
            color: 'var(--fontColor)',
            marginBottom: '5px',
            fontWeight: 700,
            marginTop: 0,
          }}
        >
          {label}
        </FormHelperText>
      )}
      <MuiSelect
        id={id}
        displayEmpty
        input={<Input />}
        sx={{ minWidth: '110px', lineHeight: '20px' }}
        {...rest}
      >
        {options.map((el, i) => (
          <MenuItem key={i} value={el.value} disabled={el.disabled}>
            {el.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
};

export default Select;

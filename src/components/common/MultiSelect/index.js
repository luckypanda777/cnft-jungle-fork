import { default as MuiSelect } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import InputBase from '@mui/material/InputBase';
import Checkbox from '@mui/material/Checkbox';
import { useState } from 'react';

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
    maxWidth: '200px',
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

const MultiSelect = ({
  options = [],
  label = undefined,
  placeholder = '',
  style,
  onChange,
  defaultValue = [],
  ...rest
}) => {
  const [selected, setSelected] = useState(defaultValue);
  const id = `${rest?.name}${Math.floor(Math.random() * 1000)}`;

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelected(value);
    if (onChange && typeof onChange === 'function') {
      onChange(value);
    }
  };

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
        labelId="checkbox-label"
        displayEmpty
        multiple
        value={selected}
        onChange={handleChange}
        renderValue={(values) => {
          if (values.length === 0) {
            return (
              <span style={{ color: 'var(--notFound)' }}>{placeholder}</span>
            );
          }

          return values.join(', ');
        }}
        input={<Input />}
        sx={{ minWidth: '110px', lineHeight: '20px' }}
        {...rest}
      >
        {options.map((el, i) => (
          <MenuItem key={i} value={el.value} disabled={el.disabled}>
            <Checkbox checked={selected.indexOf(el.value) > -1} />
            {el.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
};

export default MultiSelect;

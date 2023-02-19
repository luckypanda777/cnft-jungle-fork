import React, { useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useDebouncedCallback } from 'use-debounce';

const EditableTextField = ({
  field,
  value: initialValue,
  debounceCallback,
  type = 'text',
  prefix,
  label,
  placeholder,
}) => {
  const [value, setValue] = useState(Boolean(initialValue) ? initialValue : '');
  const [mouseOver, setMouseOver] = useState(false);

  const debounced = useDebouncedCallback((value) => {
    debounceCallback(value, field);
  }, 750);

  const handleChange = (event) => {
    setValue(event.target.value);
    debounced(event.target.value);
  };

  const handleMouseOver = () => {
    if (!mouseOver) {
      setMouseOver(true);
    }
  };

  const handleMouseOut = () => {
    if (mouseOver) {
      setMouseOver(false);
    }
  };

  return (
    <TextField
      name="email"
      defaultValue={value || 0}
      onChange={handleChange}
      type={type}
      sx={{
        fontSize: 12,
        opacity: 1,
        borderBottom: 0,
        '&:before': {
          borderBottom: 0,
        },
        width: '100%',
      }}
      variant="standard"
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOut}
      placeholder={placeholder}
      label={label}
      InputProps={{
        style: { fontSize: 12, color: 'var(--fontColor)' },
        endAdornment: mouseOver ? (
          <InputAdornment position="end">
            <EditIcon
              sx={{
                fontSize: 8,
                width: 14,
                mx: field === 'floor' ? 0.35 : 0,
              }}
              color="secondary"
            />
          </InputAdornment>
        ) : (
          <span
            style={{ fontSize: 12, width: field === 'floor' ? 'auto' : 20 }}
          >
            {prefix}
          </span>
        ),
      }}
    />
  );
};

const EditableTypography = ({
  editable = true,
  value,
  prefix,
  debounceCallback,
  containterStyles = {},
  type = 'text',
  field,
  label,
  placeholder = '',
}) => {
  return (
    <div
      style={{
        width: '100%',
        ...containterStyles,
      }}
    >
      {editable ? (
        <EditableTextField
          type={type}
          name={'editable'}
          error={value === ''}
          value={value}
          prefix={prefix}
          debounceCallback={debounceCallback}
          field={field}
          label={label}
          placeholder={placeholder}
        />
      ) : (
        <span
          style={{
            fontSize: 12,
            fontFamily: 'newgilroymedium',
            marginRight: '2px',
            marginTop: '1px',
          }}
        >
          {value} {prefix}
        </span>
      )}
    </div>
  );
};

export default EditableTypography;

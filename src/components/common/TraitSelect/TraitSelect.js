import { useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Select from '../Select';

const renderValue = (options, handleDelete) => (selected) => {
  if (selected.length === 0) {
    return <span>Any</span>;
  }

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 0.5 }}
    >
      {selected.map((value) => {
        const option = options.find((opt) => opt.value === value);
        return (
          <Chip
            key={value}
            style={{ height: '24px', justifyContent: 'flex-start' }}
            label={option.label}
            deleteIcon={<CancelIcon onMouseDown={(e) => e.stopPropagation()} />}
            onDelete={() => handleDelete(value)}
          />
        );
      })}
    </Box>
  );
};

const TraitSelect = ({ options, ...rest }) => {
  const [value, setValue] = useState([]);

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(typeof val === 'string' ? val.split(',') : val);
  };

  const handleDelete = (val) => {
    setValue((prev) => [...prev].filter((el) => el !== val));
  };

  return (
    <Select
      multiple
      options={options}
      value={value}
      onChange={handleChange}
      renderValue={renderValue(options, handleDelete)}
      {...rest}
    />
  );
};

export default TraitSelect;

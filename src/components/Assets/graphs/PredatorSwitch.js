import { styled } from '@mui/material/styles';
import {
  FormGroup,
  alpha,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import bowsvg from 'assets/bow.svg';

const PinkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: 'var(--logoColor)',
    '&:hover': {
      backgroundColor: 'var(--logoColor)',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: 'var(--logoColor)',
  },
}));

const PredatorSwitch = ({
  name = 'Wenno Mode',
  defaultChecked = false,
  onChange,
  disabled,
}) => {
  return (
    <FormGroup>
      <FormControlLabel
        onChange={onChange}
        control={
          <PinkSwitch
            sx={{ color: 'var(--logoColor)' }}
            defaultChecked={defaultChecked}
            size="medium"
            disabled={disabled}
          />
        }
        label={
          <>
            <span
              style={{
                textTransform: 'uppercase',
                fontSize: 14,
                fontWeight: 'bold',
              }}
            >
              {name}
            </span>
          </>
        }
      />
    </FormGroup>
  );
};

export default PredatorSwitch;

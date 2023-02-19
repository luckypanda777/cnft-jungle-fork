import { forwardRef, useEffect, useState } from 'react';
import ButtonUnstyled, {
  buttonUnstyledClasses,
} from '@mui/base/ButtonUnstyled';
import { styled } from '@mui/system';
import CustomTooltip from 'components/common/CustomTooltip';

const ButtonStyled = styled('button')`
  background-color: transparent;
  padding: 8px 15px;
  border-radius: 10px;
  color: #000;
  font-weight: 700;
  font-size: 12px;
  transition: all 200ms ease;
  cursor: pointer;

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FilterButton = forwardRef(
  (
    { name, onChange, value, pressable, onClick, tooltip, ...rest },
    ref,
    style
  ) => {
    const [active, setActive] = useState(value || false);

    useEffect(() => {
      setActive(value || false);
    }, [value]);

    const handleChange = () => {
      const state = !active;
      setActive(state);
      if (onChange && typeof onChange === 'function') {
        onChange(name, state);
      }
    };

    const children = (
      <ButtonUnstyled
        sx={{
          backgroundColor: active
            ? name === 'mintingNow'
              ? 'var(--tertiaryColor)'
              : 'var(--primaryColor)'
            : 'transparent',
          color: active ? '#fff' : 'var(--fontColor)',
          border: `2px solid ${
            name === 'mintingNow'
              ? 'var(--tertiaryColor)'
              : 'var(--primaryColor)'
          }`,
          '&:hover': {
            backgroundColor:
              name === 'mintingNow'
                ? 'var(--tertiaryColor)'
                : 'var(--primaryColor)',
            color: '#fff',
          },
          ...style,
        }}
        {...rest}
        ref={ref}
        component={ButtonStyled}
        onClick={pressable ? onClick : handleChange}
      />
    );

    if (tooltip) {
      return (
        <CustomTooltip
          title={tooltip}
          placement="top"
          style={{
            marginLeft: 0,
            paddingTop: 0,
          }}
        >
          {children}
        </CustomTooltip>
      );
    }

    return children;
  }
);

export default FilterButton;

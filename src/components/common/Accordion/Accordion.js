import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { Box, Divider, useTheme } from '@mui/material';
import { useAppContext } from 'context/AppContext';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = (props) => (
  <MuiAccordionSummary
    expandIcon={
      <ExpandMoreIcon
        sx={{ fontSize: '1.1rem', color: 'var(--accordionIconColor)' }}
      />
    }
    {...props}
  />
);

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const MainAccordion = ({
  label,
  children,
  transparent,
  disabled,
  style,
  defaultExpanded,
  sharp = true,
  loading = false,
  fullWidthLabel = false,
  sidebar = false,
  className = '',
  ...rest
}) => {
  const { state } = useAppContext();
  const { isMobile } = state;
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (defaultExpanded) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }, [loading]);

  const handleExpanded = (state) => {
    setExpanded(state);
  };

  return (
    <Box sx={style} className={className}>
      <Accordion
        disabled={disabled}
        sx={{
          color: 'var(--accordionColor)',
          backgroundColor: sidebar ? 'var(--accordionBg)' : 'var(--paperColor)',
          backgroundImage: 'none',
          '& .MuiAccordionSummary-content': {
            marginLeft: theme.spacing(1),
          },
          pt: transparent && 1,
          border: 'none',
          mx: isMobile ? 2 : 0,
          borderRadius: sharp ? 0 : 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        expanded={expanded}
        onChange={(_, exp) => handleExpanded(exp)}
        defaultExpanded={defaultExpanded}
      >
        <AccordionSummary
          sx={{ backgroundColor: transparent && 'transparent !important' }}
        >
          <Box
            sx={{
              display: 'flex',
              width: fullWidthLabel ? '100%' : 'fit-content',
              justifyContent: fullWidthLabel ? 'space-between' : 'flex-start',
              alignItems: 'center',
            }}
          >
            {label}
            {fullWidthLabel && (
              <span style={{ fontSize: '14px' }}>
                {expanded ? 'Collapse' : 'Expand'}
              </span>
            )}
          </Box>
          {transparent && <Divider />}
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: transparent && 0,
            border: 'none',
            pt: 0,
          }}
        >
          {children}
        </AccordionDetails>
      </Accordion>
      {transparent && <Divider sx={{ width: '90%', mx: 'auto' }} />}
    </Box>
  );
};

export default MainAccordion;

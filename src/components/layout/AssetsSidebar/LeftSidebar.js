import { useContext } from 'react';
import styles from './Sidebar.module.scss';
import Drawer from '@mui/material/Drawer';
import { useAppContext } from 'context/AppContext';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/material';
import { useTheme } from '@mui/system';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import { getFromLocalStorage } from 'utils/isEmptyObject';
import { useEffect } from 'react';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import dynamic from 'next/dynamic';
import ButtonUnstyled from '@mui/base/ButtonUnstyled';
import classNames from 'classnames';
import styled from '@emotion/styled';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MultilineChartIcon from '@mui/icons-material/MultilineChart';
import useWindowSize from 'hooks/useWindowSize';
import CustomTooltip from 'components/common/CustomTooltip';

const LiveListings = dynamic(() => import('components/LiveListings'), {
  ssr: false,
});
const FloorThickness = dynamic(
  () => import('components/Assets/graphs/FloorThickness'),
  {
    ssr: false,
  }
);
const TraitsPerformance = dynamic(
  () => import('components/filters/SalesFilters/TraitsPerformance'),
  {
    ssr: false,
  }
);
const FullFloorHistoryChart = dynamic(
  () => import('components/Assets/graphs/FullFloorHistoryChart'),
  {
    ssr: false,
  }
);
const HoldersChart = dynamic(() => import('./HoldersChart'), { ssr: false });
const RarityChart = dynamic(() => import('./RarityChart'), { ssr: false });

const ButtonRoot = styled('button')(() => ({
  display: 'inline-flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '1.5',
  letterSpacing: '0.00938em',
  padding: '12px 24px',
  width: '100%',
  textAlign: 'left',
  backgroundColor: 'var(--accordionBg)',
  border: 'none',
  borderTop: '1px solid var(--assetsBg)',
  backgroundColor: 'var(--bgColor)',
}));

function ToggleFilterButton(props) {
  return (
    <ButtonUnstyled {...props} component={ButtonRoot}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <IconButton
          disableRipple
          sx={{
            color: 'var(--fontColor)',
            borderRadius: '6px',
            backgroundColor: 'var(--lightGrey)',
            width: 40,
            height: 40,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
        <span style={{ fontSize: 20 }}>Info</span>
      </Box>
    </ButtonUnstyled>
  );
}

const LeftSidebar = ({
  open,
  handleMenu,
  style = {},
  handleOpenModal,
  filters,
  selectedTraits,
  type = 'assets',
  sales,
  loading,
}) => {
  const { showFeedback } = useContext(FeedbackContext);
  const theme = useTheme();
  const { state } = useAppContext();

  return (
    <aside
      className={classNames(
        styles.sidebar,
        !open ? styles.sidebarClosed : null
      )}
      style={{ ...style }}
    >
      {open ? (
        <>
          <ToggleFilterButton onClick={handleMenu} />
          <Box className={styles.sidebarWrapper}>
            <Box className={styles.analytics}>
              {type === 'assets' ? (
                <FullFloorHistoryChart minimizedFormat />
              ) : (
                <TraitsPerformance
                  minimizedFormat
                  sales={sales}
                  loading={loading}
                />
              )}
              {/* <Box sx={{ py: 1 }} /> */}
              <HoldersChart policyId={state.collection?.policies} />
              <Box sx={{ py: 1 }} />
              <FloorThickness textFormat />
              <Box sx={{ py: 1 }} />

              {/* <RarityChart
                policyId={state.collection?.policies}
                traits={state.collection?.traitlist}
                collectionName={state.collection?.collection_name}
                handleTraitFilter={handleTraitFilterSidebar}
                collectionId={state.collection?.id}
              /> */}

              {/* <LiveListings
                policyId={state.collection?.policies}
                onClick={handleOpenModal}
                filters={filters}
                selectedTraits={selectedTraits}
              /> */}
            </Box>
          </Box>
        </>
      ) : (
        <IconButton
          onClick={handleMenu}
          disableRipple
          sx={{
            position: 'absolute',
            color: 'var(--fontColor)',
            top: 0,
            zIndex: 1,
            right: '50%',
            transform: 'translateX(50%)',
            width: 45,
            height: 45,
            borderRadius: '10px',
            backgroundColor: 'var(--lightGrey)',
            mt: 1,
          }}
        >
          <MultilineChartIcon />
        </IconButton>
      )}
    </aside>
  );
};

const LeftSidebarComponent = (props) => {
  const {
    state: { isMobile },
  } = useAppContext();
  const { width } = useWindowSize();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenu = () => {
    setMenuOpen(!menuOpen);
    localStorage.setItem('leftSidebarOpen', !menuOpen === true ? 'yes' : 'no');
  };

  useEffect(() => {
    setMenuOpen(width > 1600);
  }, [width]);

  if (isMobile) {
    return (
      <>
        <Drawer
          anchor="right"
          open={menuOpen}
          onClose={handleMenu}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{ pb: 1 }}
        >
          <LeftSidebar open={menuOpen} handleMenu={handleMenu} {...props} />
        </Drawer>
        <IconButton onClick={handleMenu} className={styles.leftMenuIcon}>
          <MultilineChartIcon />
        </IconButton>
      </>
    );
  }

  return <LeftSidebar open={menuOpen} handleMenu={handleMenu} {...props} />;
};

export default LeftSidebarComponent;

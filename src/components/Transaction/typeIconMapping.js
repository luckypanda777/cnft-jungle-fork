import SwapVertIcon from '@mui/icons-material/SwapVert';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';

const arrowIcons = {
  row: <ArrowForwardIcon sx={{ fontSize: 32 }} />,
  column: <ArrowDownward sx={{ fontSize: 32 }} />,
};

const fireIcons = {
  row: (
    <LocalFireDepartmentIcon
      sx={{ fontSize: 32, color: 'var(--tertiaryColor)' }}
    />
  ),
  column: (
    <LocalFireDepartmentIcon
      sx={{ fontSize: 32, color: 'var(--tertiaryColor)' }}
    />
  ),
};

const swapIcons = {
  row: <SwapHorizIcon sx={{ fontSize: 32 }} />,
  column: <SwapVertIcon sx={{ fontSize: 32 }} />,
};

export const txTypeMapping = {
  MINT: { ...fireIcons, color: 'var(--tertiaryColor)' },
  SWAP: { ...swapIcons, color: 'var(--rankGrey)' },
  BURN: { ...fireIcons, color: 'var(--tertiaryColor)' },
  BUY: { ...arrowIcons, color: 'var(--undervaluedColor)' },
  SELL: { ...arrowIcons, color: 'var(--overvaluedColor)' },
  LIST: { ...arrowIcons, color: 'var(--rankGrey)' },
  DELIST: { ...arrowIcons, color: 'var(--rankGrey)' },
  TRANSFER: { ...arrowIcons, color: 'var(--rankGrey)' },
  BORROWING: { ...arrowIcons, color: 'var(--slightlyOvervalued)' },
  LENDING: { ...arrowIcons, color: 'var(--slightlyUndervalueColor)' },
};

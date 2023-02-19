import React from 'react';
import './AddressBadge.module.scss';
import orca from 'assets/jungleorca.png';
import whale from 'assets/junglewhale.png';
import { Box } from '@mui/material';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CustomTooltip from 'components/common/CustomTooltip';

const AddressBadge = ({ type = '', width = 20 }) => {
  return type === 'orca' ? (
    <div
      style={{
        width: width,
        height: width,
      }}
    >
      <CustomTooltip
        title="Collection is linked to a correct policy"
        placement="bottom"
      >
        <Box>
          <img src={orca.src} style={{ width: 24, height: 18 }} />
        </Box>
      </CustomTooltip>
    </div>
  ) : type === 'whale' ? (
    <div
      style={{
        width: width,
        height: width,
      }}
    >
      <CustomTooltip title="Wallet is a whale. Total holdings exceed 1 million ADA.">
        <Box>
          <img src={whale.src} style={{ width: 24, height: 17 }} />
        </Box>
      </CustomTooltip>
    </div>
  ) : type === 'contract' ? (
    <div
      style={{
        width: width,
        height: width,
      }}
    >
      <CustomTooltip title="Wallet is a whale. Total holdings exceed 1 million ADA.">
        <Box>
          <InsertDriveFileOutlinedIcon
            sx={{ width: 20, color: 'var(--primaryColor)' }}
          />
        </Box>
      </CustomTooltip>
    </div>
  ) : null;
};

export default AddressBadge;

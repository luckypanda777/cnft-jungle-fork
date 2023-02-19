import React, { useState } from 'react';
import './DoxxedBadge.module.scss';
import doxxedbadge from 'assets/icons/bearverified.png';
import { Box, Tooltip } from '@mui/material';
import CustomTooltip from 'components/common/CustomTooltip';
import { useEffect } from 'react';
import axios from 'axios';

const DoxxedBadge = ({ width = 20, policyId }) => {
  const [isDoxxed, setIsDoxxed] = useState(false);

  useEffect(() => {
    getIsDoxxed();
  }, [policyId]);

  const getIsDoxxed = async () => {
    try {
      const response = await axios.get(
        `https://doxxing.bearmarket.io/wp-json/wl/v1/posts?doxxed_policyid=${policyId}`
      );

      setIsDoxxed(
        response.data.map((item) => item.doxxed_policyid).includes(policyId)
      );
    } catch (err) {
      console.log(err);
      setIsDoxxed(false);
    }
  };

  if (!isDoxxed) return null;

  return (
    <CustomTooltip
      title="Collection ID-Verified by bearmarket.io"
      placement="bottom"
      style={{ paddingTop: 0, marginLeft: 3, paddingBottom: 5 }}
    >
      <Box sx={{ width: width, height: width, cursor: 'pointer' }}>
        <Box
          onClick={() =>
            window.open('https://doxxing.bearmarket.io/', '_blank')
          }
        >
          <img src={doxxedbadge.src} width={width} height={width} />
        </Box>
      </Box>
    </CustomTooltip>
  );
};

export default DoxxedBadge;

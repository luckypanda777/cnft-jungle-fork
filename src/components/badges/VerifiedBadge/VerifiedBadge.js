import React from 'react';
import './VerifiedBadge.module.scss';
import VerifiedBadgeIcon from 'assets/icons/star.svg';
import CustomTooltip from 'components/common/CustomTooltip';

const VerifiedBadge = ({ verified, width = 20 }) => {
  return verified ? (
    <div
      style={{
        width: width,
        height: width,
        paddingBottom: 3,
      }}
    >
      <CustomTooltip
        title="Collection is linked to a correct policy"
        placement="bottom"
        style={{ paddingTop: 0, marginLeft: 0 }}
      >
        <VerifiedBadgeIcon width={width} height={width} />
      </CustomTooltip>
    </div>
  ) : (
    <div
      style={{
        width: width,
        height: width,
      }}
    >
      <CustomTooltip
        title="Unverified collection"
        placement="bottom"
        style={{ paddingTop: 0 }}
      />
    </div>
  );
};

export default VerifiedBadge;

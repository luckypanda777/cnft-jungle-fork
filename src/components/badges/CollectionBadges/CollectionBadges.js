import styles from '../AssetsSidebar/Sidebar.module.scss';
import { Box, Tooltip } from '@mui/material';

const CollectionBadges = ({ featured, verified, fake, nsfw, minting }) => {
  return (
    <Box className={styles.projectBadges}>
      {!!featured && (
        <CustomTooltip title="Promoted by CNFT Jungle. To buy a promotion go to cnftjungle.io/promotions">
          <span className={[styles.featured, styles.tag]}>Promoted</span>
        </CustomTooltip>
      )}
      {!!verified && (
        <CustomTooltip title="Collection is linked to a correct policy">
          <span className={[styles.verified, styles.tag]}>Verified</span>
        </CustomTooltip>
      )}
      {!!nsfw && (
        <CustomTooltip title="Collection includes Not Safe For Work images">
          <span className={[styles.nsfw, styles.tag]}>NSFW</span>
        </CustomTooltip>
      )}
      {/* fake is official ranks in db */}
      {!!fake && (
        <CustomTooltip title="Collection has official ranks">
          <span className={[styles.fake, styles.tag]}>Official</span>
        </CustomTooltip>
      )}
      {!!minting && (
        <CustomTooltip title="Collection is currently adding assets and is available to mint">
          <span className={[styles.minting, styles.tag]}>Minting</span>
        </CustomTooltip>
      )}
    </Box>
  );
};

export default CollectionBadges;

import React, { useCallback, useContext } from 'react';
import styles from './AddToCartBadge.module.scss';
import { CircularProgress } from '@mui/material';
import { useAppContext } from 'context/AppContext';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import { useState } from 'react';
import { useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import CustomTooltip from 'components/common/CustomTooltip';

const AddToCartBadge = ({
  width = 20,
  showText,
  asset = {},
  color = 'var(--logoColor)',
  type = 'buy',
}) => {
  const {
    state: { walletInfo, cart, listingCart, loadingCart },
    setCart,
    setListingCart,
  } = useAppContext();
  const { showFeedback } = useContext(FeedbackContext);
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!walletInfo.address) return setLoading(false);

    if (type === 'buy') {
      setIsAdded(
        cart?.find((a) => {
          return a.asset_id === asset.asset_id;
        })
      );
    }

    if (type === 'sell') {
      setIsAdded(
        listingCart?.find((a) => {
          return a.asset_name === asset.name || a.asset_id === asset.asset_id;
        })
      );
    }
  }, [type, cart, listingCart, walletInfo.address]);

  const handleClick = useCallback(() => {
    try {
      // if asset in cart remvoe if not add
      if (isAdded) {
        setIsAdded(false);
        if (type === 'buy') {
          setCart(cart.filter((a) => a.asset_id !== asset.asset_id));
        }

        if (type === 'sell') {
          setListingCart(
            listingCart.filter(
              (a) =>
                a.asset_name !== asset.name && a.asset_id !== asset.asset_id
            )
          );
        }

        return showFeedback({
          message: `Removed ${asset.name} from ${
            type === 'sell' ? 'Listing' : ''
          } cart`,
          kind: 'success',
        });
      }

      setIsAdded(true);

      if (type === 'buy') {
        setCart([...cart, asset]);
      }

      if (type === 'sell') {
        setListingCart([...listingCart, asset]);
      }

      return showFeedback({
        message: `Added ${asset.name} to ${
          type === 'sell' ? 'Listing' : ''
        } cart`,
        kind: 'success',
      });
    } catch (err) {
      console.log(err);
      return showFeedback({
        message: 'Unexpected error.',
        kind: 'error',
      });
    }
  }, [cart, listingCart, walletInfo.address, isAdded, asset, loadingCart]);

  // if (walletInfo.loading || loading) {
  //   return (
  //     <div
  //       className={styles.bookmarkIconContainer}
  //       style={{ width: showText ? '100%' : width, height: width }}
  //     >
  //       <CircularProgress sx={{ color }} size={14} />
  //     </div>
  //   );
  // }

  if (!walletInfo.address) {
    return (
      <div
        className={styles.bookmarkIconContainer}
        style={{ width: showText ? '100%' : width, height: width }}
        onClick={handleClick}
      >
        <CustomTooltip
          title={`Connect wallet to save to add to cart!`}
          placement="top"
          style={{ marginLeft: 0, cursor: 'pointer' }}
        >
          <AddIcon sx={{ color: 'var(--rankGrey)', width, height: width }} />
        </CustomTooltip>
      </div>
    );
  }

  if (loadingCart) {
    return (
      <div
        className={styles.bookmarkIconContainer}
        style={{
          width: showText || loading ? '100%' : width,
          height: width,
        }}
      >
        <CustomTooltip
          title="Cart loading, please wait"
          placement="top"
          style={{ marginLeft: 0, cursor: 'pointer' }}
        >
          <CircularProgress sx={{ color: 'var(--grey)' }} size={14} />
        </CustomTooltip>
      </div>
    );
  }

  if (isAdded) {
    return (
      <div
        className={styles.bookmarkIconContainer}
        style={{ width: showText || loading ? '100%' : width, height: width }}
        onClick={handleClick}
      >
        <CustomTooltip
          title={`Remove ${asset.name} from ${
            type === 'sell' ? 'Listing' : ''
          } cart`}
          placement="top"
          style={{ marginLeft: 0, cursor: 'pointer' }}
        >
          <ClearIcon sx={{ color, width, height: width }} />
        </CustomTooltip>
      </div>
    );
  }

  return (
    <div
      className={styles.bookmarkIconContainer}
      style={{ width: showText || loading ? '100%' : width, height: width }}
      onClick={handleClick}
    >
      <CustomTooltip
        title={`Add ${asset.name} to ${type === 'sell' ? 'Listing' : ''} cart`}
        placement="top"
        style={{ marginLeft: 0, cursor: 'pointer' }}
      >
        <AddIcon sx={{ color, width, height: width }} />
      </CustomTooltip>
    </div>
  );
};

export default AddToCartBadge;

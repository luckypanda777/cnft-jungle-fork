import { Box, Button, Divider, Skeleton, Tooltip } from '@mui/material';
import moment from 'moment';
import { useRouter } from 'next/router';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { getChangeValue } from 'utils/change';
import BookmarkedBadge from 'components/badges/BookmarkedBadge';
import orca from 'assets/jungleorca.png';
import whale from 'assets/junglewhale.png';
import VerifiedBadge from 'components/badges/VerifiedBadge';
import AddressBadge from 'components/badges/AddressBadge';
import { middlen } from 'utils/shorten';
import CustomTooltip from 'components/common/CustomTooltip';
import useWindowSize from 'hooks/useWindowSize';
import AddToCartBadge from 'components/badges/AddToCartBadge';
import { useMemo } from 'react';

export const defaultStyles = {
  display: 'flex',
  alignItems: 'center',
  px: 2,
  py: 1,
  borderRadius: 2,
  justifyContent: 'space-between',
};

export const imageDefaultStyles = {
  borderRadius: 10,
  width: 50,
  height: 50,
  marginRight: 10,
};

export const spaceBetween = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const smallAddressLinkStyle = {
  fontSize: 12,
  cursor: 'pointer',
  color: 'var(--primaryColor)',
};

const addressLinkStyle = {
  fontSize: 16,
  cursor: 'pointer',
  color: 'var(--primaryColor)',
};

export const columnStyles = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
};

export const VerticalDivider = () => {
  return (
    <Divider
      orientation="vertical"
      sx={{
        width: '1px',
        height: '80%',
        my: 'auto',
        mx: 1,
      }}
    />
  );
};

export const AddressLink = ({
  prefix = '',
  address,
  style = smallAddressLinkStyle,
  length = 10,
  fontSize = 12,
}) => {
  const router = useRouter();

  return (
    <span
      style={{ ...style, fontSize }}
      onClick={() =>
        router.push(`/portfolio/${address}` + parseInt(Math.random() * 10))
      }
    >
      {prefix}
      {middlen(address, length) || 'addr...777'}
    </span>
  );
};
export const TxLink = ({
  prefix = '',
  txHash,
  style = smallAddressLinkStyle,
  length = 10,
  fontSize = 12,
}) => {
  const router = useRouter();

  return (
    <span
      style={{ ...style, fontSize }}
      onClick={() => router.push(`/transaction/${txHash}`)}
    >
      {prefix}
      {middlen(txHash, length) || 'tx...777'}
    </span>
  );
};

const AssetBoxSkeleton = ({ fullWidth, border }) => {
  const { width } = useWindowSize();
  const isFullWidth = width < 1000 || fullWidth;

  return (
    <Box
      sx={{
        width: isFullWidth ? '100%' : 'auto',
        flex: isFullWidth ? '1 0 90%' : width > 1400 ? '1 0 25%' : '1 0 40%',
        ...defaultStyles,
        backgroundColor: border ? 'transparent' : 'var(--lightGrey)',
        border: border ? '1px solid var(--primaryColor)' : 'none',
        py: 1.25,
        height: 45,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flex: 1,
          alignItems: 'center',
        }}
      >
        <Box>
          <Skeleton
            width={50}
            height={50}
            variant="rectangular"
            sx={{ borderRadius: 2, mr: 1 }}
          />
        </Box>
        <Box sx={columnStyles}>
          <Box sx={spaceBetween}>
            <Skeleton width={125} height={20} variant="text" />
            <Skeleton width={125} height={20} variant="text" />
          </Box>
          <Box sx={spaceBetween}>
            <Skeleton width={125} height={10} variant="text" />
            <Skeleton width={125} height={10} variant="text" />
          </Box>
          <Box sx={spaceBetween}>
            <Skeleton width={125} height={10} variant="text" />
            <Skeleton width={125} height={10} variant="text" />
          </Box>
        </Box>
      </Box>
      <VerticalDivider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          rowGap: 1,
        }}
      >
        <Skeleton width={15} height={15} variant="rect" />
        <Skeleton width={15} height={15} variant="rect" />
      </Box>
    </Box>
  );
};

const AddressBoxSkeleton = ({ fullWidth, border }) => {
  const { width } = useWindowSize();
  const isFullWidth = width < 1000 || fullWidth;

  return (
    <Box
      sx={{
        width: isFullWidth ? '100%' : 'auto',
        flex: isFullWidth ? '1 0 90%' : width > 1400 ? '1 0 25%' : '1 0 40%',
        ...defaultStyles,
        backgroundColor: border ? 'transparent' : 'var(--lightGrey)',
        border: border ? '1px solid var(--primaryColor)' : 'none',
        py: 1.25,
        height: 37.5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flex: 1,
          alignItems: 'center',
        }}
      >
        {/* <Box>
          <Skeleton
            width={35}
            height={35}
            variant="rectangular"
            sx={{ borderRadius: 2, mr: 1 }}
          />
        </Box> */}
        <Box sx={columnStyles}>
          <Box sx={spaceBetween}>
            <Skeleton width={80} height={20} variant="text" />
            <Skeleton width={40} height={20} variant="text" />
          </Box>
          <Box sx={{ ...spaceBetween, alignItems: 'flex-start' }}>
            <Skeleton width={175} height={10} variant="text" />
            {/* <Skeleton width={125} height={10} variant="text" /> */}
          </Box>
        </Box>
      </Box>
      <VerticalDivider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          rowGap: 1,
        }}
      >
        <Skeleton width={15} height={15} variant="rect" />
        <Skeleton width={15} height={15} variant="rect" />
      </Box>
    </Box>
  );
};

const MockAssets = ({
  dense = false,
  fullWidth = false,
  white = false,
  loading = false,
  border = false,
  data = new Array(24).fill(0),
  initialLoad = false,
  showIcons = ['bookmark', 'verified'],
  mint = false,
}) => {
  const { width } = useWindowSize();
  const isFullWidth = width < 1000 || fullWidth;
  const memoizedData = useMemo(() => data, [data]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: dense ? 1 : 2,
        justifyContent: 'space-between',
      }}
    >
      {memoizedData.map((asset, i) => {
        const change = Math.random() * 2 - 1;

        const { changeColor, changeText } = getChangeValue(change, true);

        if (asset.loading || initialLoad) {
          return <AssetBoxSkeleton fullWidth={isFullWidth} border={border} />;
        }

        return (
          <Box
            sx={{
              width: isFullWidth ? '100%' : 'auto',
              flex: isFullWidth
                ? '1 0 90%'
                : width > 1400
                ? '1 0 25%'
                : '1 0 40%',
              background: white ? 'var(--bgColor)' : 'var(--lightGrey)',
              border: border ? '1px solid var(--primaryColor)' : 'none',
              ...defaultStyles,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flex: 1,
                alignItems: 'center',
              }}
            >
              <img
                src={
                  asset.image ||
                  'https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200'
                }
                style={imageDefaultStyles}
              />
              <Box sx={columnStyles}>
                <Box sx={spaceBetween}>
                  <span>{asset.name || `Asset Name ${i}`}</span>
                  <span style={{ fontSize: 12 }}>
                    {mint ? 'Mint' : 'Buy'} Price:{' '}
                    {asset.initialPrice || parseInt(Math.random() * 100)} ADA
                  </span>
                </Box>
                <Box sx={spaceBetween}>
                  <span style={{ fontSize: 14 }}>
                    Value: {asset.currentPrice || parseInt(Math.random() * 500)}{' '}
                    ADA <span style={{ color: changeColor }}>{changeText}</span>
                  </span>
                  <span style={{ fontSize: 12 }}>
                    {asset.date || moment().format('DD/MM/YY HH:mm UTC')}
                  </span>
                </Box>
                <Box sx={spaceBetween}>
                  <AddressLink
                    address={asset.fromAddress}
                    prefix="From: "
                    length={isFullWidth ? 8 : 5}
                  />
                  <AddressLink
                    address={asset.toAddress}
                    prefix="To: "
                    length={isFullWidth ? 8 : 5}
                  />
                </Box>
              </Box>
            </Box>
            <VerticalDivider />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {showIcons.includes('cart') && (
                <AddToCartBadge asset={asset} type="buy" />
              )}
              {showIcons.includes('listingCart') && (
                <AddToCartBadge asset={asset} type="sell" />
              )}
              {showIcons.includes('bookmark') && (
                <BookmarkedBadge
                  bookmarked={asset.bookmarked}
                  kind="asset"
                  width={22}
                />
              )}
              {showIcons.includes('verified') && (
                <VerifiedBadge verified={asset.verified} width={18} />
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

const MockTrades = ({
  dense = false,
  fullWidth = false,
  mint = false,
  white = false,
  loading = false,
  border = false,
  data = new Array(24).fill(0),
  initialLoad = false,
  showIcons = ['bookmark', 'verified'],
}) => {
  const { width } = useWindowSize();
  const isFullWidth = width < 1000 || fullWidth;
  const memoizedData = useMemo(() => data, [data]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: dense ? 1 : 2,
        justifyContent: 'space-between',
      }}
    >
      {memoizedData.map((asset, i) => {
        const change = Math.random();
        const changeColor = mint
          ? 'goldenrod'
          : change > 0.66
          ? 'var(--undervaluedColor)'
          : change > 0.33
          ? 'var(--tradeLoss)'
          : 'var(--fontColor)';
        const plus = change > 0 ? '+' : '';
        const changeText = change
          ? `${plus}${(change * 100).toFixed(2)}%`
          : '=0%';

        if (asset.loading || initialLoad) {
          return <AssetBoxSkeleton fullWidth={isFullWidth} border={border} />;
        }

        const tradeType = mint
          ? 'Mint'
          : change > 0.66
          ? 'Buy'
          : change > 0.33
          ? 'Sell'
          : 'List';

        const tradeText =
          tradeType === 'Mint'
            ? 'Mint Price: '
            : tradeType === 'Buy'
            ? 'Buy Price: '
            : tradeType === 'Sell'
            ? 'Sell Price: '
            : 'Buy for: ';

        return (
          <Box
            sx={{
              width: isFullWidth ? '100%' : 'auto',
              flex: isFullWidth
                ? '1 0 90%'
                : width > 1400
                ? '1 0 25%'
                : '1 0 40%',
              background: white ? 'var(--bgColor)' : 'var(--lightGrey)',
              ...defaultStyles,
              border: border ? '1px solid var(--primaryColor)' : 'none',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flex: 1,
                alignItems: 'center',
              }}
            >
              <img
                src="https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200"
                style={imageDefaultStyles}
              />
              <Box sx={columnStyles}>
                <Box sx={spaceBetween}>
                  <span>Asset Name {i}</span>
                  <Box
                    style={{
                      fontSize: 14,
                      display: 'flex',
                      alignItems: 'center',
                      columnGap: 3,
                      marginBottom: 3,
                    }}
                  >
                    {tradeType === 'List' ? (
                      <span
                        style={{
                          fontSize: 14,
                          color: 'var(--logoColor)',
                          textDecoration: 'underline',
                          textDecorationColor: 'var(--logoColor)',
                          cursor: 'pointer',
                        }}
                      >
                        Buy for {parseInt(Math.random() * 1000)} ADA
                      </span>
                    ) : (
                      <>
                        <span>{tradeText}</span>
                        <span>{parseInt(Math.random() * 1000)} ADA</span>
                      </>
                    )}
                  </Box>
                </Box>
                <Box sx={spaceBetween}>
                  <span
                    style={{
                      fontSize: 14,
                      color: changeColor,
                    }}
                  >
                    {tradeType}
                  </span>
                  <span style={{ fontSize: 12 }}>
                    {moment().format('DD/MM/YY HH:mm UTC')}
                  </span>
                </Box>
                <Box sx={spaceBetween}>
                  <AddressLink
                    address="addr1qxp4ggttyqz3k2gkme9r7gqyp4gzjyvfjqqreqpfpp5dtp705rp4xesducet64d5ql6m053pkxe6cmhrk5jl6zvr23eqcsuck8"
                    prefix="From: "
                    length={isFullWidth ? 8 : 5}
                  />
                  <TxLink
                    txHash="tx12301238120381209"
                    prefix="Tx Hash: "
                    length={isFullWidth ? 8 : 5}
                  />
                </Box>
              </Box>
            </Box>
            <VerticalDivider />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {showIcons.includes('cart') && (
                <AddToCartBadge asset={asset} type="buy" />
              )}
              {showIcons.includes('listingCart') && (
                <AddToCartBadge asset={asset} type="sell" />
              )}
              {showIcons.includes('bookmark') && (
                <BookmarkedBadge
                  bookmarked={asset.bookmarked}
                  kind="asset"
                  width={22}
                />
              )}
              {showIcons.includes('verified') && (
                <VerifiedBadge verified={asset.verified} width={18} />
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

const MockAddresses = ({
  dense = false,
  fullWidth = false,
  white = false,
  loading = false,
  border = false,
  data = new Array(24).fill(0),
  initialLoad = false,
}) => {
  const { width } = useWindowSize();
  const isFullWidth = width < 1000 || fullWidth;
  const memoizedData = useMemo(() => data, [data]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: dense ? 1 : 2,
        justifyContent: 'space-between',
      }}
    >
      {memoizedData.map((item, i) => {
        if (item.loading || initialLoad) {
          return <AddressBoxSkeleton fullWidth={isFullWidth} border={border} />;
        }

        const random = Math.random();

        return (
          <Box
            sx={{
              width: isFullWidth ? '100%' : 'auto',
              flex: isFullWidth
                ? '1 0 90%'
                : width > 1400
                ? '1 0 25%'
                : '1 0 40%',
              background: white ? 'var(--bgColor)' : 'var(--lightGrey)',
              ...defaultStyles,
              border: border ? '1px solid var(--primaryColor)' : 'none',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flex: 1,
                alignItems: 'center',
              }}
            >
              {/* <img
                src="https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200"
                style={imageDefaultStyles}
              /> */}
              <Box sx={columnStyles}>
                <Box sx={spaceBetween}>
                  <AddressLink
                    address="addr1qxp4ggttyqz3k2gkme9r7gqyp4gzjyvfjqqreqpfpp5dtp705rp4xesducet64d5ql6m053pkxe6cmhrk5jl6zvr23eqcsuck8"
                    length={10}
                  />
                  <span style={{ fontSize: 12 }}>{i * 10} actions</span>
                </Box>
                <Box sx={spaceBetween}>
                  <span style={{ fontSize: 12 }}>
                    Last action: {moment().format('DD/MM/YY HH:mm UTC')}
                  </span>
                </Box>
              </Box>
            </Box>
            <VerticalDivider />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <BookmarkedBadge bookmarked={false} kind="wallet" width={22} />
              <AddressBadge
                type={
                  random > 0.66 ? 'orca' : random > 0.33 ? 'whale' : 'contract'
                }
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

const MockHolders = ({
  dense = false,
  fullWidth = false,
  white = false,
  loading = false,
  border = false,
  data = new Array(24).fill(0),
  initialLoad = false,
}) => {
  const { width } = useWindowSize();
  const isFullWidth = width < 1000 || fullWidth;

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: dense ? 1 : 2,
        justifyContent: 'space-between',
      }}
    >
      {data.map((item, i) => {
        const change = Math.random() * 2 - 1;

        const { changeColor, changeText } = getChangeValue(change, true);

        if (item.loading || initialLoad) {
          return <AddressBoxSkeleton fullWidth={isFullWidth} border={border} />;
        }

        return (
          <Box
            sx={{
              width: isFullWidth ? '100%' : 'auto',
              flex: isFullWidth
                ? '1 0 90%'
                : width > 1400
                ? '1 0 25%'
                : '1 0 40%',
              background: white ? 'var(--bgColor)' : 'var(--lightGrey)',
              ...defaultStyles,
              border: border ? '1px solid var(--primaryColor)' : 'none',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flex: 1,
                alignItems: 'center',
              }}
            >
              {/* <img
                src="https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200"
                style={imageDefaultStyles}
              /> */}
              <Box sx={columnStyles}>
                <Box sx={spaceBetween}>
                  <AddressLink address="addr1qxp4ggttyqz3k2gkme9r7gqyp4gzjyvfjqqreqpfpp5dtp705rp4xesducet64d5ql6m053pkxe6cmhrk5jl6zvr23eqcsuck8" />
                  <span style={{ fontSize: 12 }}>{i * 10} NFTs</span>
                </Box>
                <Box sx={spaceBetween}>
                  <span style={{ fontSize: 14 }}>
                    Holdings:{' '}
                    {item.currentPrice || parseInt(Math.random() * 500)} ADA{' '}
                    <span style={{ color: changeColor }}>{changeText}</span>
                  </span>
                  <span style={{ fontSize: 12 }}>
                    Last activity: {moment().format('DD/MM/YY HH:mm UTC')}
                  </span>
                </Box>
              </Box>
            </Box>
            <VerticalDivider />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <BookmarkedBadge bookmarked={false} kind="wallet" width={22} />
              <CustomTooltip title="Wallet is a whale. Total holdings exceed 1 million ADA.">
                <Box>
                  <img src={orca.src} style={{ width: 24, height: 18 }} />
                </Box>
              </CustomTooltip>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export { MockAssets, MockAddresses, MockTrades, MockHolders };

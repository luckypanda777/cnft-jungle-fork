import { Box, Button, Divider, Grid, Tooltip } from '@mui/material';
import CustomTooltip from 'components/common/CustomTooltip';
import TextHeader from 'components/common/TextHeader';
import { useEffect, useState } from 'react';
import { useAppContext } from 'context/AppContext';
import {
  AddressLink,
  columnStyles,
  defaultStyles,
  imageDefaultStyles,
  MockAssets,
  spaceBetween,
  TxLink,
  VerticalDivider,
} from 'components/Portfolio/data/mockAssets';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import useWindowSize from 'hooks/useWindowSize';
import moment from 'moment';
import { txTypeMapping } from './typeIconMapping';
import BookmarkedBadge from 'components/badges/BookmarkedBadge';
import VerifiedBadge from 'components/badges/VerifiedBadge';
import SimplifiedModal from 'components/modals/AssetModal/SimplifiedModal';
import imgOptimizerReplace from 'utils/imgOptimizerReplace';
import { nFormatter } from 'utils/formatCurrency';

const Tokens = ({ tokens = [], index, type }) => {
  if (tokens.length === 0) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: 1,
      }}
    >
      <span style={{ fontSize: 20 }}>Tokens</span>

      <Box sx={{ display: 'flex', gap: 1, px: 2, flexWrap: 'wrap' }}>
        {tokens.map((token, index) => {
          return (
            <Box sx={{ display: 'flex', columnGap: 2, alignItems: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  // flexDirection: 'column',
                  p: '7.5px 15px',
                  borderRadius: '10px',
                  border: '1px solid var(--primaryColor)',
                  columnGap: 0.5,
                }}
                key={index}
              >
                <span style={{ fontSize: 14, color: 'var(--primaryColor)' }}>
                  {token.amount > 1000000
                    ? nFormatter(parseInt(token.amount), 2)
                    : token.amount.toLocaleString()}
                </span>
                <span style={{ fontSize: 14 }}>{token.name}</span>
              </Box>
              {/* {index !== tokens.length - 1 && <AddIcon fontSize="medium" />} */}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

const Assets = ({ assets = [], onClick }) => {
  const { width } = useWindowSize();
  if (assets.length === 0) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: 1,
        width: '100%',
      }}
    >
      <span style={{ fontSize: 20 }}>NFTs</span>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          justifyContent: 'flex-start',
          pl: 2,
        }}
      >
        {assets.map((asset, index) => (
          <Box
            sx={{
              width: width < 900 ? '100%' : 'fit-content',
              minWidth: width < 900 ? '90%' : 250,
              maxWidth: 'fit-content',
              background: 'var(--bgColor)',
              border: '1px solid var(--primaryColor)',
              ...defaultStyles,
              cursor: 'pointer',
            }}
            onClick={() => onClick(asset)}
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
              <Box sx={columnStyles} style={{ rowGap: 5 }}>
                <Box sx={spaceBetween} style={{ fontSize: 18 }}>
                  <span>{asset.name || `Asset Name ${i}`}</span>
                </Box>
                <Box sx={spaceBetween}>
                  <span style={{ fontSize: 14 }}>
                    Value: {asset.currentPrice || parseInt(Math.random() * 500)}{' '}
                    ADA
                  </span>
                </Box>
              </Box>
            </Box>
            <Divider
              orientation="vertical"
              sx={{
                width: '1px',
                height: 35,
                my: 'auto',
                mx: 1,
              }}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <BookmarkedBadge
                identifier={asset.asset_id}
                kind="asset"
                width={22}
              />
              <VerifiedBadge verified={asset.verified} width={18} />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const Address = ({ address, type }) => {
  const text = type === 'Output' ? 'Receiver: ' : 'Sender: ';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: 1,
        alignItems: 'flex-end',
        position: 'absolute',
        top: 15,
        right: 15,
      }}
    >
      <Box sx={{ display: 'flex' }}>
        <span style={{}}>{text}</span>
        <span style={{ marginLeft: 3 }}>
          <AddressLink fontSize={16} address={address} />
        </span>
      </Box>
    </Box>
  );
};

const TransactionSide = ({ side, type, onClick }) => {
  return (
    <WhiteCard
      sx={{
        width: 'auto',
        height: 'fit-content',
        m: 0,
        p: 0,
        background: 'transparent',
      }}
    >
      <Box style={{ fontSize: 24, textAlign: 'center', width: '100%' }}>
        {type === 'Input' ? 'Assets sent' : 'Assets received'}
      </Box>
      {side.map((data, index) => (
        <Box
          key={index}
          sx={{
            rowGap: 2,
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            borderRadius: '10px',
            // border: '2px solid var(--grey)',
            backgroundColor: 'var(--bgColor)',
            my: 2,
            position: 'relative',
          }}
        >
          {/* <span
            style={{
              fontSize: 16,
              color: '--lightGrey',
              fontFamily: 'gilroylight',
              position: 'absolute',
              top: 15,
              right: 15,
            }}
          >
            {type === 'Input' ? 'From' : 'To'} #{index + 1}
          </span> */}

          <Tokens tokens={data.tokens} type={type} />
          <Assets assets={data.assets} onClick={onClick} />
          <Address address={data.from} type={type} />
        </Box>
      ))}
    </WhiteCard>
  );
};

const TransactionType = ({ type, direction }) => {
  console.log(type, direction);
  return (
    <Box sx={{ mt: direction == 'row' ? 6 : 0 }}>
      {txTypeMapping[type][direction]}
    </Box>
  );
};

const Transaction = ({ transaction }) => {
  console.log(transaction);
  const {
    state: { isMobile },
  } = useAppContext();
  const { width } = useWindowSize();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState({});
  const onClick = (asset) => {
    if (asset && (asset.image || asset.optimized_image)) {
      if (asset.optimized_image) {
        asset.optimized_image = imgOptimizerReplace(asset);
      } else {
        asset.image = imgOptimizerReplace(asset);
      }
    }

    setSelectedAsset(asset);
    setModalOpen(true);
  };

  const direction = width > 1400 ? 'row' : 'column';
  console.log(selectedAsset);

  return (
    <Box
      sx={{
        width: '100%',
        mx: 'auto',
        paddingLeft: 0,
        position: 'relative',
        mt: 1,
        p: isMobile ? 1 : 0,
      }}
    >
      <TextHeader
        title="Cardano NFTs transaction breakdown"
        subtitle="Understand what is going on in the transaction"
        helpText=" Understand what is going on in the transaction"
        socialText="Missing transaction or wrong data? Contact us!"
      />
      <WhiteCard
        sx={{
          m: 0,
          mb: 2,
          height: 'fit-content',
          width: 'auto',
          display: 'flex',
          flexDirection: 'column',
          rowGap: width < 900 ? 1 : 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: width < 900 ? 'column' : 'row',
            rowGap: width < 900 ? 1 : 0,
          }}
        >
          <span
            style={{
              fontSize: 32,
              display: 'flex',
              columnGap: 5,
            }}
          >
            <span style={{ color: txTypeMapping[transaction.type].color }}>
              {transaction.type}
            </span>
            Transaction
          </span>
          <span>
            Created at:{' '}
            {moment(transaction.created_at).format('DD/MM/YYYY:HH:mm:ss')}
          </span>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: width < 900 ? 'column' : 'row',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              columnGap: 2,
              flexDirection: width < 900 ? 'column' : 'row',
            }}
          >
            <Box sx={{ display: 'flex', columnGap: width < 900 ? 2 : 1 }}>
              <Box sx={{ display: 'flex' }}>
                <span style={{ color: 'var(--rankGrey' }}>Est. Value: </span>
                <span style={{ marginLeft: 3 }}>
                  {parseInt(Math.random() * 1000000).toLocaleString()} ADA
                </span>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <span style={{ color: 'var(--rankGrey' }}>NFTs: </span>
                <span style={{ marginLeft: 3 }}>100</span>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', columnGap: width < 900 ? 2 : 1 }}>
              <Box sx={{ display: 'flex' }}>
                <span style={{ color: 'var(--rankGrey' }}>Tokens: </span>
                <span style={{ marginLeft: 3 }}>10</span>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <span style={{ color: 'var(--rankGrey', marginRight: 5 }}>
                  Hash:{' '}
                </span>
                <TxLink txHash={transaction.txHash} fontSize={16} />
              </Box>
            </Box>
          </Box>
          <span>{moment(transaction.created_at).fromNow()}</span>
        </Box>
      </WhiteCard>
      <Box
        sx={{
          display: 'flex',
          flexDirection: direction,
          gap: 2,
          width: '100%',
          alignItems: width > 1400 ? 'flex-start' : 'center',
          mt: 3,
        }}
      >
        <Box sx={{ width: '100%' }}>
          {/* INPUT */}
          <TransactionSide
            side={transaction.inputs}
            type="Input"
            onClick={onClick}
          />
        </Box>
        <TransactionType type={transaction.type} direction={direction} />
        <Box sx={{ width: '100%' }}>
          {/* OUTPUT */}
          <TransactionSide
            side={transaction.outputs}
            type="Output"
            onClick={onClick}
          />
        </Box>
      </Box>
      <SimplifiedModal
        open={modalOpen}
        assetId={selectedAsset?.asset_id}
        policyId={selectedAsset?.policy_id}
        setOpenModal={setModalOpen}
      />
    </Box>
  );
};

export default Transaction;

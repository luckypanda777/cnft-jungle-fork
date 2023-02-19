import React, { useEffect, useRef, useState } from 'react';
import { getAssets } from 'apiProvider';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import { Popover, Box, CircularProgress, IconButton } from '@mui/material';
import { initialAnchorOrigin, initialTransformOrigin } from './HuntPopover';
import PreviewIcon from '@mui/icons-material/Preview';
import LiveHuntBox from 'components/Sniping/Platform/LiveHunting/LiveHunts/LiveHuntBox';
import { useCallback } from 'react';
import AssetModal from 'components/modals/AssetModal';
import FilterButton from 'components/buttons/FilterButton';

const HuntPreview = ({ search, minified = true }) => {
  const anchor = useRef();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const onClick = (asset) => {
    setSelectedAsset(asset);
    setModalOpen(true);
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const collection = search.rules.find((rule) => rule.label === 'collection');

  useEffect(() => {
    if (open) {
      getHuntListings();
    }
  }, [open]);

  const getHuntListings = useCallback(async () => {
    setLoading(true);

    console.log(search.rules.find((rule) => rule.label === 'traits')?.value);

    const huntTraits =
      search.rules.find((rule) => rule.label === 'traits')?.value || [];

    const traits =
      // check by key trait.split(' / ')[0] and apped the value trait.split(' / ')[1]
      huntTraits
        .map((trait) => {
          let traitKey = trait.split(' / ')[0];
          let traitValue = trait.split(' / ')[1];

          // check if trait includes attributes
          if (trait.includes('attributes')) {
            traitKey = 'attributes / ' + trait.split(' / ')[1];
            traitValue = trait.split(' / ')[2];
          }

          return {
            traitKey,
            traitValue,
          };
        })
        .reduce((acc, trait) => {
          if (!acc[trait.traitKey]) {
            acc[trait.traitKey] = [trait.traitValue];
          } else {
            acc[trait.traitKey].push(trait.traitValue);
          }
          return acc;
        }, {});

    let params = {
      priceMin: search.rules.find((rule) => rule.label === 'priceMin')?.value,
      priceMax: search.rules.find((rule) => rule.label === 'priceMax')?.value,
      rarityMin: search.rules.find((rule) => rule.label === 'rarityMin')?.value,
      rarityMax: search.rules.find((rule) => rule.label === 'rarityMax')?.value,
      traits: Object.keys(traits).length > 0 ? traits : null,
    };

    params = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null)
    );

    // remove params that are not in labels

    try {
      const { assets } = await getAssets(collection.value?.policies, {
        onSale: true,
        sort: 'price',
        sortDirection: 'asc',
        ...params,
      });
      console.log(assets);
      setListings(assets);
    } catch (err) {
      console.log(err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  return (
    <>
      {minified ? (
        <IconButton
          onClick={handleOpen}
          ref={anchor}
          sx={{
            color: 'var(--fontColor)',
            '&:hover': { opacity: 0.9 },
          }}
        >
          <PreviewIcon fontSize="medium" />
        </IconButton>
      ) : (
        <FilterButton
          disabled={!collection?.value?.policies}
          pressable
          onClick={handleOpen}
          ref={anchor}
          sx={{
            border: 'none',
            width: 300,
            backgroundColor: 'var(--lightGrey)',
            color: !collection?.value?.policies
              ? 'var(--rankGrey)'
              : 'var(--fontColor)',

            '&:hover': {
              opacity: 0.9,
            },
          }}
        >
          {!collection?.value?.policies
            ? 'Select Collection First'
            : 'Show Listings'}
        </FilterButton>
      )}

      <Popover
        sx={{ pointerEvents: 'none' }}
        open={open}
        anchorEl={anchor.current}
        anchorOrigin={initialAnchorOrigin}
        transformOrigin={initialTransformOrigin}
        onClose={handleClose}
        PaperProps={{
          onMouseLeave: handleClose,
          sx: {
            borderRadius: '10px',
            pointerEvents: 'auto',
            backgroundColor: 'var(--assetsBg)',
            backgroundImage: 'none',
          },
        }}
        disableRestoreFocus
      >
        <WhiteCard
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            m: 0,
            rowGap: 1,
            width: 375,
            color: 'var(--fontColor)',
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress sx={{ fontSize: 20 }} />
              </Box>
            </Box>
          ) : !collection?.value ? (
            <span>Select collection first</span>
          ) : listings.length === 0 ? (
            <span>No listings found</span>
          ) : (
            listings.map((asset) => (
              <LiveHuntBox
                key={asset.asset_id}
                asset={{
                  assetName: asset.name,
                  assetNumber: asset.num,
                  assetImage: asset.optimized_image || asset.image,
                  assetID: asset.asset_id,
                  price: asset.listing_price * 1000000,
                  ...asset,
                }}
                sx={{ width: '100%', mx: 'auto', maxWidth: 350 }}
                onClick={onClick}
              />
            ))
          )}
        </WhiteCard>
      </Popover>
      <AssetModal
        open={modalOpen}
        assetId={selectedAsset?.asset_id}
        collection={{ traitlist: {} }}
        setOpenModal={setModalOpen}
        sort={{
          sort: 'score',
          sortDirection: 'asc',
        }}
      />
    </>
  );
};

export default HuntPreview;

import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import WatchlistFilters from '../filters/WatchlistFilters';
import ActivityFilters from '../filters/ActivityFilters';
import MintsFilters from '../filters/MintsFilters';
import ListingsFilters from '../filters/ListingsFilters';
import PortfolioFilters from '../filters/PortfolioFilters';
import { useState } from 'react';
import AssetModal from 'components/modals/AssetModal';

const PortfolioBottom = ({ tab, groupBy, setGroupBy, changeTab, address }) => {
  const TabComponent = tab.component;

  const [filters, setFilters] = useState({});
  const [openAssetModal, setOpenAssetModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState({});
  const handleFilters = (field, value) => {
    setFilters((prevState) => ({ ...prevState, [field]: value }));
  };

  return (
    <>
      {!tab.hideFilters && (
        <WhiteCard
          sx={{
            mt: 0,
            height: 'auto',
            minHeight: 65,
            maxHeight: 'fit-content',
            p: 0,
            alignItems: 'center',
            display: 'flex',
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        >
          {tab.label === 'portfolio' && (
            <PortfolioFilters
              display={groupBy}
              handleDisplay={setGroupBy}
              handleFilters={handleFilters}
              filters={filters}
            />
          )}
          {tab.label === 'listings' && (
            <ListingsFilters
              display={groupBy}
              handleDisplay={setGroupBy}
              handleFilters={handleFilters}
              filters={filters}
            />
          )}
          {tab.label === 'mints' && (
            <MintsFilters
              display={groupBy}
              handleDisplay={setGroupBy}
              handleFilters={handleFilters}
              filters={filters}
            />
          )}
          {tab.label === 'activity' && (
            <ActivityFilters
              display={groupBy}
              handleDisplay={setGroupBy}
              handleFilters={handleFilters}
              filters={filters}
            />
          )}
          {tab.label === 'watchlist' && (
            <WatchlistFilters
              display={groupBy}
              handleDisplay={setGroupBy}
              handleFilters={handleFilters}
              filters={filters}
            />
          )}
        </WhiteCard>
      )}
      <WhiteCard
        sx={{
          mt: !tab.hideFilters ? 0 : 3,
          height: 'fit-content',
          mb: 3,
          borderTopRightRadius: tab.hideFilters ? '6px' : 0,
          borderTopLeftRadius: tab.hideFilters ? '6px' : 0,
        }}
      >
        <TabComponent
          groupBy={groupBy}
          changeTab={changeTab}
          setGroupBy={setGroupBy}
          filters={filters}
          address={address}
          setSelectedAsset={setSelectedAsset}
        />
      </WhiteCard>
      <AssetModal
        open={openAssetModal}
        assetId={selectedAsset?.asset_id}
        collection={selectedAsset.collection}
        setOpenModal={setOpenAssetModal}
        sort={{}}
      />
    </>
  );
};

export default PortfolioBottom;

import GavelIcon from '@mui/icons-material/Gavel';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import BoltIcon from '@mui/icons-material/Bolt';
import BalanceIcon from '@mui/icons-material/Balance';

const ListingTypeIcon = ({ listing_type = 'listing', styles }) => {
  const defaultStyles = { mr: 0.5 };
  const mergedStyles = {
    sx: { ...defaultStyles, ...styles },
    fontSize: 'small',
  };

  if (listing_type === 'auction') {
    return <GavelIcon {...mergedStyles} />;
  }

  if (listing_type === 'offer') {
    return <BalanceIcon {...mergedStyles} />;
  }

  if (listing_type === 'smartcontract') {
    return <BoltIcon {...mergedStyles} />;
  }

  return <LocalOfferIcon {...mergedStyles} />;
};

export default ListingTypeIcon;

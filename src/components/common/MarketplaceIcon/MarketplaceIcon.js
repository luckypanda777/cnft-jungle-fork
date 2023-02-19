import jpgstore from 'assets/icons/jpgstore.png';
import deadpxlz from 'assets/icons/dead.png';
import cnftio from 'assets/icons/cnftio.jpeg';
import cardahub from 'assets/icons/cardahub.png';
import nftjam from 'assets/icons/nftjam.gif';
import artifct from 'assets/icons/artifct.png';
import tokhun from 'assets/icons/tokhun.png';
import SpacebudzIcon from 'assets/icons/spacebudz.svg';
import EpochIcon from 'assets/icons/epoch.svg';
import GenesisIcon from 'assets/icons/genesis_house_logo.svg';

const MarketplaceIcon = ({ marketplace = 'jpgstore', width }) => {
  const defaultStyle = {
    marginRight: 10,
    borderRadius: '50%',
  };
  const dimensions = {
    width: 15,
    ...width,
  };

  if (marketplace === 'jpgstore') {
    return (
      <img
        src={jpgstore.src}
        {...dimensions}
        style={{ ...defaultStyle, borderRadius: 0 }}
      />
    );
  }

  if (marketplace === 'epochart') {
    return <EpochIcon style={defaultStyle} />;
  }

  if (marketplace === 'artifct') {
    return <img src={artifct.src} width={20} style={defaultStyle} />;
  }

  if (marketplace === 'tokhun') {
    return <img src={tokhun.src} width={20} style={defaultStyle} />;
  }

  if (marketplace === 'cnftio') {
    return <img src={cnftio.src} width={20} style={defaultStyle} />;
  }

  if (marketplace === 'genesishouse') {
    return <GenesisIcon style={defaultStyle} width={20} />;
  }

  if (marketplace === 'spacebudz') {
    return <SpacebudzIcon style={defaultStyle} height={20} />;
  }

  if (marketplace === 'deadpxlz') {
    return (
      <img
        src={deadpxlz.src}
        width={20}
        style={{ ...defaultStyle, borderRadius: 0 }}
      />
    );
  }

  if (marketplace === 'cardahub') {
    return <img src={cardahub.src} width={22} style={defaultStyle} />;
  }

  if (marketplace === 'nftjam') {
    return <img src={nftjam.src} width={20} style={defaultStyle} />;
  }

  return (
    <img
      src={jpgstore.src}
      {...dimensions}
      style={{ ...defaultStyle, borderRadius: 0 }}
    />
  );
};

export default MarketplaceIcon;

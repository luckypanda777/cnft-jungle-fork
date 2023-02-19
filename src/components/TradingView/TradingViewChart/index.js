import React from 'react';
import dynamic from 'next/dynamic';

const TradingViewChart = dynamic(() => import('./TradingViewChart'), {
  ssr: false,
});

const Index = (props) => {
  return <TradingViewChart {...props} />;
};

export default Index;

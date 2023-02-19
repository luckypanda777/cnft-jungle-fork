import React from 'react';
import {useRouter} from "next/router";
import * as analytics from '../config/analytics';

const useGoogleAnalytics = () => {
  const location = useRouter();

  React.useEffect(() => {
    analytics.init();
  }, []);

  React.useEffect(() => {
    const currentPath = location.asPath;
    analytics.sendPageview(currentPath);
  }, [location]);
};

export { useGoogleAnalytics };

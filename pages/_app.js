import '../styles/fonts.scss';
import '../styles/nprogress.scss';
import '../styles/globals.scss';
import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import Router from 'next/router';
import NProgress from 'nprogress';
// APP STUFF
import { Provider as AppProvider } from 'context/AppContext';
import { Provider as FeedbackProvider } from 'context/FeedbackContext';
import { Provider as AuthProvider } from 'context/AuthContext';
import { Provider as SearchProvider } from 'context/SearchContext';

import App from 'next/app';
import Cookies from 'js-cookie';
import Layout from 'components/Layout';
import StaticHead from 'components/StaticHead';
import { CacheProvider } from '@emotion/react';
import { DefaultSeo } from 'next-seo';
import { ThemeProvider } from 'next-themes';
import SEO from '../next-seo.config';
import createEmotionCache from 'utils/createEmotionCache';
import Script from 'next/script';

// UX a
NProgress.configure({ showSpinner: false, minimum: 0.65 });
// TODO: mb later make nprogress do not trigger on query change
Router.events.on('routeChangeStart', NProgress.start);
Router.events.on('routeChangeComplete', NProgress.done);
Router.events.on('routeChangeError', NProgress.done);

const clientSideEmotionCache = createEmotionCache();

const displayVariants = ['small', 'large', 'list'];

function Page({
  Component,
  pageProps,
  theme,
  assetCardVariant,
  isMobile,
  emotionCache = clientSideEmotionCache,
}) {
  const appInitialState = {
    //theme,
    isMobile,
    localFilters: {
      display: !displayVariants.includes(assetCardVariant)
        ? 'list'
        : assetCardVariant,
    },
  };

  const headerEnabled =
    pageProps && pageProps.hasOwnProperty('header') ? pageProps.header : true;

  return (
    <ThemeProvider disableTransitionOnChange defaultTheme="dark">
      <CacheProvider value={emotionCache}>
        <StaticHead />
        <DefaultSeo {...SEO} />
        <AppProvider appInitialState={appInitialState}>
          <FeedbackProvider>
            <AuthProvider>
              <SearchProvider>
                <Layout mode="dark" header={headerEnabled}>
                  <Component {...pageProps} />
                </Layout>
              </SearchProvider>
            </AuthProvider>
          </FeedbackProvider>
        </AppProvider>
        <Script
          src="../scripts/InjectDappConnector.js"
          strategy="afterInteractive"
        />
      </CacheProvider>
    </ThemeProvider>
  );
}

Page.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const { ctx } = appContext;

  let theme, assetCardVariant, userAgent;

  if (ctx.req) {
    userAgent = ctx.req.headers['user-agent'];

    if ('cookies' in ctx.req) {
      theme = 'dark'; //ctx.req.cookies.theme || 'light';
      assetCardVariant = ctx.req.cookies['asset_card_variant'] || 'small';
    } else {
      theme = 'dark'; //Cookies.get('theme') === 'dark' ? 'dark' : 'light';
      assetCardVariant = Cookies.get('asset_card_variant');
    }
  } else {
    userAgent = navigator.userAgent;
  }

  // Mb update with parse function or smth to be more precise about isMobile but is ok for now
  const isMobile = Boolean(
    userAgent.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
    )
  );

  return { ...appProps, theme, assetCardVariant, isMobile };
};

export default Page;

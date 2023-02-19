import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from 'utils/createEmotionCache';
import Cookies from 'js-cookie';
import Script from 'next/script';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage;

    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    // let theme;
    //
    // if (ctx.req && 'cookies' in ctx.req) {
    //   theme = ctx.req.cookies.theme || 'light';
    // } else {
    //   theme = Cookies.get('theme') === 'dark' ? 'dark' : 'light';
    // }

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) =>
          function EnhanceApp(props) {
            return <App emotionCache={cache} {...props} />;
          },
      });

    const initialProps = await Document.getInitialProps(ctx);
    // This is important. It prevents emotion to render invalid HTML.
    // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    return {
      ...initialProps,
      emotionStyleTags,
      //theme,
    };
  }

  render() {
    const { theme, emotionStyleTags } = this.props;

    return (
      <Html lang="en" data-theme={theme} style={{ colorScheme: theme }}>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
          <script src="/static/datafeeds/udf/dist/bundle.js" />
          {emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
          <script src="../scripts/CardanoDAppConnectorBridgeDApp.js" />
          {/*<script
            dangerouslySetInnerHTML={{
              __html: `
            console.log('Test: init bridge', window.cardano)

            async function checkAPI(fullApi, method) {
            
              const args = [...arguments]
            
              args.shift()
              args.shift()
            
              console.log('DApp: '+method+': send', args)
            
              let res
            
              if(args.length > 0) {
            
                res = await fullApi[method](...args)
            
              } else {
            
                res = await fullApi[method]()
              }
            
              console.log('DApp: '+method+': response:', res)
            
              return res
            }
            
            async function checkExpAPI(fullApi, method) {
            
              const args = [...arguments]
            
              args.shift()
              args.shift()
            
              console.log('DApp: '+method+': send', args)
            
              let res
            
              if(args.length > 0) {
            
                res = await fullApi.experimental[method](...args)
            
              } else {
            
                res = await fullApi.experimental[method]()
              }
            
              console.log('DApp: '+method+': response:', res)
            }
            
            initCardanoDAppConnectorBridge(async () => {
            
              // Bridge was esteblished by the wallet.
            
              console.log('DApp: init done:', window.cardano)
            
              if(window.hasOwnProperty('cardano') && window.cardano.eternl) {
            
                console.log('DApp: connected')
                console.log('DApp: enable: send')
            
                const fullApi = await window.cardano.eternl.enable()
            
                console.log('DApp: enable: response:', fullApi)
            
                if(fullApi) {
            
                  await checkAPI(fullApi, 'getNetworkId')
                  await checkAPI(fullApi, 'getBalance')
                  await checkAPI(fullApi, 'getUsedAddresses')
                  await checkAPI(fullApi, 'getUnusedAddresses')
                  await checkAPI(fullApi, 'getRewardAddresses')
                  await checkAPI(fullApi, 'getChangeAddress')
                  await checkAPI(fullApi, 'getUtxos')
                  await checkExpAPI(fullApi, 'getCollateral')
                  await checkExpAPI(fullApi, 'getLockedUtxos')
            
                  // const debugTx = await checkAPI(fullApi, 'signTx', '', false, true)
                  //
                  // await checkAPI(fullApi, 'signTx', debugTx, false)
                }
              }
            })
            `,
            }}
          />*/}
        </body>
      </Html>
    );
  }
}

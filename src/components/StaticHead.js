import Head from 'next/head';

function StaticHead() {
  return (
    <Head>
      <link rel="icon" href="../favicon.ico" />
      <link rel="apple-touch-icon" href="./claw.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="./claw.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="./claw.png" />
      <link rel="apple-touch-icon" sizes="167x167" href="./claw.png" />
      <meta name="apple-touch-fullscreen" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content="Jungle" />
      {/** iPhone X (1125px x 2436px) */}
      <link
        rel="apple-touch-startup-image"
        media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
        href="./1125x2436.png"
      />
      {/** iPhone 8, 7, 6s, 6 (750px x 1334px) */}
      <link
        rel="apple-touch-startup-image"
        media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
        href="./750x1334.png"
      />
      {/** iPhone 8 Plus, 7 Plus, 6s Plus, 6 Plus (1242px x 2208px) */}
      <link
        rel="apple-touch-startup-image"
        media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)"
        href="./1242x2208.png"
      />
      {/** iPhone 5 (640px x 1136px) */}
      <link
        rel="apple-touch-startup-image"
        media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
        href="./640x1136.png"
      />
      {/** iPad Mini, Air (1536px x 2048px) */}
      <link
        rel="apple-touch-startup-image"
        media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
        href="./1536x2048.png"
      />
      {/** iPad Pro 10.5" (1668px x 2224px) */}
      <link
        rel="apple-touch-startup-image"
        media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
        href="./1668x2224.png"
      />
      {/** iPad Pro 12.9" (2048px x 2732px) */}
      <link
        rel="apple-touch-startup-image"
        media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
        href="./2048x2732.png"
      />
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1"
      />
      <meta name="theme-color" content="#2296f3" />
      <meta
        name="title"
        content="CNFT Jungle - All about NFTs on Cardano in one place"
      />

      <meta
        name="google-site-verification"
        content="jZ-iqAE2OtxQJDF9eso9J5hPVRDPRvDsebCShi2znyk"
      />
    </Head>
  );
}

export default StaticHead;

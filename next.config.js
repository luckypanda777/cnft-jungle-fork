const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@babel/preset-react',
  '@fullcalendar/common',
  '@fullcalendar/daygrid',
  '@fullcalendar/react',
  '@fullcalendar/timegrid',
  '@sentry/nextjs',
]);

const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    /*		const wasmExtensionRegExp = /\.wasm$/;
		config.resolve.extensions.push('.wasm');

		config.module.rules.forEach((rule) => {
			(rule.oneOf || []).forEach((oneOf) => {
				if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
					oneOf.exclude.push(wasmExtensionRegExp);
				}
			});
		});*/

    return config;
  },
  async headers() {
    const ContentSecurityPolicy = `
      frame-ancestors self https://www.cnftjungle.io/ https://cnftjungle.io/ https://staging.cnftjungle.io/ https://metadata.cnftjungle.io/ https://staging.eternl.io/ https://eternl.io/ ionic: capacitor: chrome-extension: http://localhost:*/ https://localhost:*/;
      `;

    return [
      {
        source: '/:path*', // We need to use this strange syntax to include the root itself: https://github.com/vercel/next.js/issues/14930
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          /*{
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },*/
        ],
      },
    ];
  },
  images: {
    domains: [
      'image-optimizer-on-demand-55l7x7mqsa-uc.a.run.app',
      'storage.googleapis.com',
      'service.cnftpredator.tools',
      'images.jpgstoreapis.com',
      'd3exlhvlmmfsby.cloudfront.net',
      'pbs.twimg.com',
      'ewr1.vultrobjects.com',
      'global-uploads.webflow.com',
      'image-optimizer.jpgstoreapis.com',
    ],
  },
};

module.exports = withTM(nextConfig);

module.exports = {
	siteUrl: 'https://cnftjungle.io/',
	generateRobotsTxt: true, // (optional)
	exclude: ['/collections-map.xml'],
	robotsTxtOptions: {
		policies: [
			{
				userAgent: '*',
				allow: '/',
			},
		],
		additionalSitemaps: [
			'https://cnftjungle.io/sitemap.xml',
			'https://cnftjungle.io/collections-map.xml',
		],
	},
}
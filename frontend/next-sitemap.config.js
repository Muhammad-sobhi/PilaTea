/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://pilatea.com',
  generateRobotsTxt: true,
  exclude: ['/admin/**'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
};

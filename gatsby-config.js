module.exports = {
  siteMetadata: {
    title: 'Yong Lee',
    tagline: 'frontend web dev'
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data`,
      }
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: `language-js`,
              inlineCodeMarker: null,
              aliases: {}
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 900
            }
          },
        ],
      },
    },
    `gatsby-plugin-sass`,
    // {
    //   resolve: `gatsby-plugin-typography`,
    //   options: {
    //     pathToConfigModule: `src/utils/typography.js`
    //   }
    // }
  ]
};
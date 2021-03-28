module.exports = {
  siteMetadata: {
    title: "offset-me",
  },
  plugins: [
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`,
      },
    },
    {
      resolve: `gatsby-transformer-csv`,
      options: {
        ignoreEmpty: true,
      },
    },
    {
      resolve: `gatsby-plugin-paypal`,
      options: {
        clientId: `AQiyCnJccT4VDYRHoHsLIQea8gDOxxK2BZ33LCIlAm4LgUcEu5NEsfz_YsPJsqFT2kr0KiIcvIyHBANa`,
        currency: `GBP`,
      },
    },
  ],
};

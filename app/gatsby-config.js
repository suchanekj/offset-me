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
        clientId: `AY9o9-y2kiJGH7FePCf_jxCsjKGrtgqjF5VXqgNSuNeDllyfrmqLShYQbcXAFIVEIHRTRjIDQdmtQs5l`,
        currency: `GBP`,
      },
    },
  ],
};

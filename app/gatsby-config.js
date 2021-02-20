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
        nodePerFile: true,
      },
    },
  ],
};

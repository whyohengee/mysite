const {createFilePath} = require('gatsby-source-filesystem');
const path = require('path'); //new

exports.onCreateNode = ({node, getNode, boundActionCreators}) => {
  const {createNodeField} = boundActionCreators;
  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({node, getNode, basePath: `blog`});
    createNodeField({
      node,
      name: `slug`,
      value: slug
    });
  }
};


exports.createPages = ({graphql, boundActionCreators}) => {
  const {createPage} = boundActionCreators; //new
  return new Promise((resolve, reject) => {
    graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
    `)
    .then(result => {
      //all this is new, except resolve()
      result.data.allMarkdownRemark.edges.forEach(({node}) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve(`./src/templates/blog-post.js`),
          context: {
            //Data passed to context is available in page queries as GraphQL vars
            slug: node.fields.slug
          }
        });
      });
      resolve();
    })
  });
};


exports.onCreatePage = async ({page, boundActionCreators}) => {
  const {createPage} = boundActionCreators;

  return new Promise((resolve, reject) => {
     if (page.path.match(/^\/$/)) {
        page.layout = 'landing-page';
        createPage(page);
     }
      resolve();
  });
};
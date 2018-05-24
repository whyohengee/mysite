import React from 'react';
import Link from 'gatsby-link';

export default({data}) => {
  return (
    <div className="allPostsWrapper">
      <h1>Favors to future me</h1>
      <div>

        <p className="allPosts__description">I love learning new things. Unfortunately, it's hard to retain everything. I wrote these blog posts as a favor to "Future Me." Writing them gives me a deeper understanding, and the posts are things I can refer back to. Hopefully helpful to others, too!</p>
      </div>

      {data.allMarkdownRemark.edges.map( ({node}, index) => (
        <div className="allPosts__postblock" key={index}>
          <Link className="allPosts__link" to={node.fields.slug}>
            <h4>{node.frontmatter.title}</h4>
          </Link>
          <p className="allPosts__date">{node.frontmatter.date}</p>
          <p className="allPosts__excerpt">{node.excerpt}</p>
          <p className="allPosts__ttr">Time to read—about {node.timeToRead} minutes</p>
        </div>
      ))}
    </div>
  );
};


export const query = graphql`
  query AllBlogPostsQuery {
    allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
      totalCount
      edges {
        node {
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
          }
          fields {
            slug
          }
          timeToRead
          excerpt
        }
      }
    }
  }
`
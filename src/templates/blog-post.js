import React from 'react';

export default ({data}) => {
  const post = data.markdownRemark;
  console.log(post)
  return (
    <div>
      <article>
        <h1 className="post-title">{post.frontmatter.title}</h1>
        <h2 className="post-date">{post.frontmatter.date}</h2>
        <div className="post-content" dangerouslySetInnerHTML={{__html: post.html}}></div>
      </article>
    </div>
  );
};

export const query = graphql`
  query BlogPostContentQuery($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`;
---
title: Creating pages from Markdown files in Gatsby JS
date: 2018-05-10
---

<div class="blog-header-img">
  <img src="https://media.giphy.com/media/l0HlOBZcl7sbV6LnO/giphy.gif" alt="flipping through pages">
</div>

In my [last post](/generating-slugs-in-gatsby), I wrote about how to create slugs for pages generated from Markdown files in Gatsby JS, and add those slugs to the Markdown nodes.

To do it, we implemented the [`onCreateNode` API](https://www.gatsbyjs.org/docs/node-apis/#onCreateNode) available to Gatsby JS, and wrote it in a file we created called `gatsby-node.js`.

In this post, I'm diving into how to programmatically create the pages from these markdown files.

Like the last post, I'm following along with the excellent [Gatsby JS tutorial](https://www.gatsbyjs.org/tutorial/) and just filling in details that might help future me or anyone else.

There are some steps that are needed first, so reference that last post [add link] before diving in here.


##Implementing the `createPages` API
We implemented the [`onCreateNode` API](https://www.gatsbyjs.org/docs/node-apis/#onCreateNode) in our `gatsby-node.js` file.

In the same file, we're going to implement the [`createPages` API](https://www.gatsbyjs.org/docs/node-apis/#createPages), which tells plugins to add pages.

So the first thing we do is export the `createPages` function...you can add it under the exported `onCreateNode` function:

```jsx
exports.createPages = () => {};
```

We're passing in an object with two properties to this exported function: [`graphql`](https://www.gatsbyjs.org/docs/querying-with-graphql/) and [`boundActionCreators`](https://www.gatsbyjs.org/docs/bound-action-creators/):

```jsx
exports.createPages = ({graphql, boundActionCreators}) => {};
```

The `graphql` argument allows us to query for the Markdown slugs we created in the last step[add link], and `boundActionCreators` is a collection of functions that help us manipulate state on our site...from this collection, we'll be using a function called [`createPage`](https://www.gatsbyjs.org/docs/bound-action-creators/#createPage), but more on that in a sec.

Now in the exported function, we're going to be returning a Promise object[add link to Promises blog post here] that will be resolved when a `graphql` query is successfully run. We're querying for all the slugs for our Markdown nodes. When the query is successfully run, we're going to log the results to the console using [JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)...here's what that looks like:


```jsx
exports.createPages = ({graphql, boundActionCreators}) => {
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
      console.log(JSON.stringify(result, null, 2))
      resolve();
    })
  });
};
```

When you log the results, it will look something like this (in my example, I have 3 Markdown files with slugs for each, which is what you're seeing here):

```jsx
  {
  "data": {
    "allMarkdownRemark": {
      "edges": [
        {
          "node": {
            "fields": {
              "slug": "/clock/"
            }
          }
        },
        {
          "node": {
            "fields": {
              "slug": "/soundeffects_keyboard/"
            }
          }
        },
        {
          "node": {
            "fields": {
              "slug": "/using_js_with_css_vars/"
            }
          }
        }
      ]
    }
  }
}
```

Great, we've implemented the `createPages` API in our `gatsby-node.js` file, returning slugs for all of our Markdown files...the next step is to create a page template component.


##Creating a page template component
Since this is React, where everything is a component, our page template will also be a component. When we create a page, we need to specifiy which component to use.

The first thing we want to do is create a new directory at `src/templates`. In it, we're going to add a file called `blog-post.js`. For now, we're just using a functional component and returning a single `<div>`:

```jsx
import React from 'react';

export default () => {
  return <div>Hey there. I'm a template for blog posts.</div>
};
```

So now we want to update our `gatsby-node.js` file. There's a lot we're going to do, which I'll break down after the code:

```jsx
const path = require('path'); //new

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
```

The first thing to note is that we're bringing in the [Node JS `path` module](https://nodejs.org/api/path.html), which provides utilities for working with file and directory paths. We'll use `path` in `createPages`.

When the query returns its value, we take the result—this is all happening in `.then()` btw—and we loop through each node. For each, we're calling the [`createPage`](https://www.gatsbyjs.org/docs/bound-action-creators/#createPage) method from our `boundActionCreators` collection.

We're passing a page object into the `createPage` method with three properties:

* The path for the page, which will be the slug
* The template component for the page, which will be the `blog-post.js` template component we just created (note: this is where we're using `path`)
* The slug for the page, which is the Markdown node's slug (details in my last post)[add link here]. That comment—that `Data passed to context is available in page queries as GraphQL vars`—is going to be important in our next step. Just hang on.

After restarting the dev server, when you navigate to any of the slugs, you'll see the returned `<div>` from our `blog-post.js` template component.

Alright, let's get data from our Markdown files—the content of our posts—into the template component.


##Creating page content from Markdown data
We're going to edit our `blog-post.js` template component...before, we were just returning a boring `<div>`. Here, we're going to create a new GraphQL query which will query for the HTML content of the Markdown file, along with the post's title and date, which we're grabbing from the frontmatter of the file:

```jsx
import React from 'react';
import Link from 'gatsby-link';

export default ({data}) => {
  const post = data.markdownRemark;
  return (
    <div>
      <h1>{post.frontmatter.title}</h1>
      <h2>{post.frontmatter.date}</h2>
      <div dangerouslySetInnerHTML={{__html: post.html}}></div>
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
```

So what's going on here?

Let's start with the query. [GraphQL lets you use variables in your queries](http://graphql.org/learn/queries/#variables), which allow for dynamic data to be sent in a query (the example they use is adding the selection from a dropdown to the query...you don't know what the selection will be, so you use a variable to handle the options). This was a great post by [Clay Allsop](https://twitter.com/clayallsopp) [explaining GraphQL variables](https://medium.com/the-graphqlhub/graphql-tour-variables-58c6abd10f56).

In the line where we declare `query BlogPostContentQuery($slug: String!)`, what we're saying is that this query accepts one variable, `$slug`, and that it will be a required String.

Where does the `$slug` value come from? Well remember that the above is happening in our template component, `blog-post.js`. This file was the "target" for our created pages, which we wrote in our `gatsby-node.js` file in the `createPages` implementation. In that exported function—`createPages`— we ran a query that asked for the slugs...once that query was completed, we passed each result of the query to the `createPage()` method, which defined the template component for each returned slug to be the `blog-post.js` component—this component. And it's this file/context's query that accepts the `$slug` variable. Got that? 😜

This is my first run at using GraphQL, but it's already impressive. And a lot to learn! Here's what the [GraphQL docs say about variables](http://graphql.org/learn/queries/#variables):

When we start working with variables, we need to do three things:

1. Replace the static value in the query with `$variableName`

2. Declare `$variableName` as one of the variables accepted by the query (that's where we declare `$slug: String!`)

3. Pass `variableName: value` in the separate, transport-specific (usually JSON) variables dictionary (I *think* this happened in our `createPages` function in `gatsby-node.js`, where we pass the slug, and receive it here in our query where we are defining for each `markdownRemark` node a `fields` object, whose value includes the `$slug` variable).

By doing this—passing the slug as a variable—we create the flexibility to reuse the template component for each slug.

Now in the component that will render, we receive as an argument the `{data}` from the query—that is, the content from the Markdown files.

We declare a variable, `const post = markdownRemark`, to work with the post content.

Throughout our React component, we can now access the content of the post by using our `post` variable, things like the title (`post.frontmatter.title`) for example.

One thing to note is that for the body of the post, we're placing everything within the a `<div>`, where we use an attribute called `dangerouslySetInnerHTML`.


##Quick note about `dangerouslySetInnerHTML`
I had to dig a little deeper into this one.

Ok, first, let's talk about what `innerHTML` is. According to the [docs](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML), `Element.innerHTML` is a property that gets or sets the HTML markup for the element that it's declared in.

Basically, you can use this property with JavaScript to set the markup for any element on your page. This is a pretty big security risk, to be able to insert not just markup, but scripts to your page. Although HTML5 specifies that a `<script>` tag inserted with the `innerHTML` property should not execute, there are still ways to execute JavaScript without the `<script>` tags.

There's a warning on the [docs page](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) that states that using `innerHTML` will result in a rejected security review. So in short, don't use it.

So what's `dangerouslySetInnerHTML`?

According to the [React docs](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml), the `dangerouslySetInnerHTML` property is React's replacement. It allows you to set HTML directly from React, but you have to type out `dangerouslySetInnerHTML`, and you have to pass an object with a `__html` key...both as reminders of the risk.

In our template component in `blog-post.js`, we have this `<div>` where we are adding our blog post content:

```jsx
<div dangerouslySetInnerHTML={{__html: post.html}}></div>
```

Note that the value of `dangerouslySetInnerHTML` is an object with a key/value pair, the key being `__html`, and the value being the contents of the `post`.

There's actually a performance boost to using `dangerouslySetInnerHTML`, too, according to this good [Stack Overflow explanation](https://stackoverflow.com/questions/37337289/react-js-set-innerhtml-vs-dangerouslysetinnerhtml#37339542):

<div class="quote">
  <p>Because React uses a virtual DOM, when it goes to compare the diff against the actual DOM, it can straight up bypass checking the children of that node because it knows the HTML is coming from another source. So there's performance gains.</p>
  <p><strong>More importantly</strong>, if you simply use innerHTML, React has no way to know the DOM node has been modified. The next time the render function is called, <strong>React will overwrite the content</strong> that was manually injected with what it thinks the correct state of that DOM node should be.</p>
</div>

So <strong>never</strong> use `innerHTML` (I can't remember the last time I used it anyway), and with React, use `dangerouslySetInnerHTML`. Got it.

Now with all of that, we finally have content from our Markdown files displaying as pages in our Gatsby JS site. The next and final step is to link to our new blog post pages.


##Creating links to our blog posts
I created a new page at `src/pages/all-blog-posts.js`, and it's on this page that I'll have a list of links to all of my blog posts.

On that page, let's focus on the GraphQL query first:

```jsx
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
```

A couple of things to note:

* We're sorting our MarkdownRemark nodes by using a sorting function, where we specify the value we're sorting on—in this case, the date in descending (newest at top) order.
* We're formatting the date of each node to read as something like: "January 1, 3000".
* There are some cool fields available to you automatically, like `excerpt` and an estimate of the `timeToRead` the post...nice! We're using those too.


So that's the data we're pulling into this list of blog posts from each Markdown node. The returned data will go into our component, and it will look like this:

```jsx
export default({data}) => {
  return (
    <div>
      <h1>All the blog posts</h1>
      <h2>{ data.allMarkdownRemark.totalCount } Posts</h2>
      {data.allMarkdownRemark.edges.map( ({node}, index) => (
        <div>
          <Link to={node.fields.slug}>
            <h4>{node.frontmatter.title}</h4>
          </Link>
          <h4>{node.frontmatter.date}</h4>
          <p>Time to read—about {node.timeToRead} minutes</p>
          <p>{node.excerpt}</p>
        </div>
      ))}
    </div>
  );
};
```
We're going to loop through all of our Markdown nodes, and for each, we're creating a Gatsby `<Link>` component. The `to` value—the `href` or target of the link—will be the node's slug.

We're also adding info like each post's title, date, time to read, and an excerpt.

Here's what the full file will look like, including the `import` statements:

```jsx
import React from 'react';
import Link from 'gatsby-link';

import React from 'react';
import Link from 'gatsby-link';

export default({data}) => {
  return (
    <div>
      <h1>All the blog posts</h1>
      <h2>{ data.allMarkdownRemark.totalCount } Posts</h2>
      {data.allMarkdownRemark.edges.map( ({node}, index) => (
        <div>
          <Link to={node.fields.slug}>
            <h4>{node.frontmatter.title}</h4>
          </Link>
          <h4>{node.frontmatter.date}</h4>
          <p>Time to read—about {node.timeToRead} minutes</p>
          <p>{node.excerpt}</p>
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
```


So there we go—we have a working blog 😆






##Resources
<div class="resources">
  <ul>
    <li><a href="https://www.gatsbyjs.org/docs/node-apis/#onCreateNode">Gatsby JS onCreateNode API</a></li>
    <li><a href="https://www.gatsbyjs.org/tutorial/">Gatsby JS Tutorial</a></li>
    <li><a href="https://www.gatsbyjs.org/docs/node-apis/#createPages">Gatsby createPages API</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify">JSON.stringify</a></li>
    <li><a href="https://nodejs.org/api/path.html">Node JS Path Module</a></li>
    <li><a href="http://graphql.org/learn/queries/#variables">GraphQL Variables</a></li>
    <li><a href="https://medium.com/the-graphqlhub/graphql-tour-variables-58c6abd10f56">GraphQL Tour: Variables</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML">MDN: innerHTML</a></li>
    <li><a href="https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml">React JS: dangerouslySetInnerHTML</a></li>
  </ul>
</div>
import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import Header from '../components/Header';
import MainNav from '../components/MainNav';
import Footer from '../components/Footer';
// import {rhythm} from '../utils/typography';
// require("prismjs/themes/prism-coy.css");
require('../assets/scss/base/prism-coy.css');
import styles from '../assets/scss/main.scss';


export default ({children, data}) => (
  // Note: unlike most children props, the children prop passed to layouts is a function and needs to be called
  <div className="main-wrapper">
    <Helmet>
      <title>Yong C. Lee</title>
      <meta name="description" content="Yong C. Lee's portfolio site"/>
      <meta name="keywords" content="portfolio, frontend, frontend web development, web development, javascript, scss, css, sass, html"/>
    </Helmet>
    <Header>
      <Link to="/" className="main-header-link"><h1>{data.site.siteMetadata.title} <span>{data.site.siteMetadata.tagline}</span></h1></Link>
    </Header>
    <MainNav className="main-nav"></MainNav>
    <div>{children()}</div>

    <Footer />

</div>
);

export const query = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
        tagline
      }
    }
  }
`
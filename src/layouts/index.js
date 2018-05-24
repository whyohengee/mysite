import React from 'react';
import Link from 'gatsby-link';
import Header from '../components/Header';
import MainNav from '../components/MainNav';
import Footer from '../components/Footer';
// import {rhythm} from '../utils/typography';
require("prismjs/themes/prism-coy.css");
import styles from '../assets/scss/main.scss';


export default ({children, data}) => (
  // Note: unlike most children props, the children prop passed to layouts is a function and needs to be called
  <div className="main-wrapper">

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
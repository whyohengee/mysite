import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import MainNav from '../components/MainNav';
import Header from '../components/Header';
import SocialIcons from '../components/SocialIcons';
// require('prismjs/themes/prism-coy.css');
require('../assets/scss/base/prism-coy.css');
import styles from '../assets/scss/main.scss';

export default ({children, data}) => (
  <div className="landingPage__wrapper">
  <Helmet>
      <title>Yong C. Lee</title>
      <meta name="description" content="Yong C. Lee's portfolio site"/>
      <meta name="keywords" content="portfolio, frontend, frontend web development, web development, javascript, scss, css, sass, html"/>
    </Helmet>
  <MainNav className="landingPage__nav"></MainNav>


  <div className="landingPage__primary">
    <h3>hi! my name is</h3>
    <h1>yong <span>(it rhymes with song)</span></h1>
    <h4>and I'm a frontend web developer</h4>
  </div>
  <div className="landingPage__secondary">
    <SocialIcons />
  </div>

  <div>{children}</div>
  </div>
);
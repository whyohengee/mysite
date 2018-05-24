import React from 'react';
import Link from 'gatsby-link';
import SocialIcons from './SocialIcons';
import '../../node_modules/font-awesome/css/font-awesome.min.css';

export default() => (
  <div className="footer">

    <SocialIcons />

  </div>
);


/* Need to think about best way to add these to footer, make it clear they're not associated w/ Social Icons */
// <div className="menu-links">
//   <Link to="/">Home</Link>
//   <Link to="/work/">Work</Link>
//   <Link to="/all-blog-posts/">Writing</Link>
//   <Link to="/about/">About</Link>
// </div>
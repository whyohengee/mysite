import React from 'react';
import Link from 'gatsby-link';

export default({children}) => (
  <div className="main-nav">
    <Link to="/">Home</Link>
    <Link to="/work/">Work</Link>
    <Link to="/all-blog-posts/">Writing</Link>
    <Link to="/about/">About</Link>
  </div>
);
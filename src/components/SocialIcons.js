import React from 'react';
import Link from 'gatsby-link';

export default() => (
  <div className="social-icons">
    <div className="github">
      <a href="https://github.com/whyohengee">
        <i className="fa fa-github"/>

      </a>
    </div>
    <div className="codepen">
      <a href="https://codepen.io/whyohengee/">
        <i className="fa fa-codepen"/>
      </a>
    </div>
    <div className="twitter">
      <a href="https://twitter.com/yongclee">
        <i className="fa fa-twitter"/>
      </a>
    </div>
    <div className="email">
      <a href="mailto:whyohengee@gmail.com">
        <i className="fa fa-envelope"/>
      </a>
    </div>
  </div>
);
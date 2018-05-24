import React from 'react';
import Link from 'gatsby-link';
import profilepic from '../assets/img/yonglee_profile.jpg';

export default({children}) => (
  <div className="aboutWrapper">
    <h1>About Me</h1>
    <div className="aboutContentWrapper">
        <div className="aboutImgWrapper">
            <img src={profilepic} alt="Yong Lee profile" className="about-pic" alt="Yong's profile pic"/>
        </div>
        <div className="aboutTextWrapper">
            <p>Hey!</p>
            <p>I'm a <a href="https://twitter.com/search?q=%23juniordevforlife&lang=en">forever-student of web development</a> and design that enjoys building user experiences with HTML, CSS, and JavaScript.</p>
            <p>I've been building things for the web for over four years, and I'm currently digging further into React JS and Node. In the past, I've worked on projects using WordPress, Django, and Flask, and I love thinking about user experience and UI design/development.</p>
            <p>I like to <Link to="/all-blog-posts/">write about what I've learned</Link> and enjoy learning from and working alongside passionate people.</p>
            <p>I'm also an avid reader, writer, and aspiring illustrator. I spend as much time as I can outside, running, cycling, and hiking.</p>
            <p><Link to="/creating-pages-from-markdown-files-in-gatsby/">I built this site using the fun and super-fast Gatsby JS.</Link></p>
            <p>Want to get in touch? Shoot me an <Link to="mailto:whyohengee@gmail.com">email</Link>, I'm happy to talk!</p>
        </div>
    </div>
  </div>
);
import React from 'react';
import Link from 'gatsby-link';
import cndlsScreencap from '../assets/img/cndls_screencap.png';
import teachingCommonsScreencap from '../assets/img/teachingcommons_screencap.png';
import tlisiScreencap from '../assets/img/tlisi_screencap.png';
import gatsbyScreencap from '../assets/img/great_gatsby.jpg';
import jsProjects from '../assets/img/js_projects.png';




export default({children}) => (
  <div className="workpageWrapper">

    <div className="workBlock">
      <img className="workBlock__image" src={cndlsScreencap} />
      <div className="workBlock__info">
        <h3 className="workBlock__title">CNDLS Website</h3>
        <div className="workBlock__blurb">
          <div className="workBlock__description">
          I used to work at a teaching and learning center at Georgetown University, and this is their main site, built in Django. I wrote templates in HTML/CSS with Bootstrap, and also wrote Django views in Python for dynamic data that populated the templates.
          </div>
        <div className="workBlock__tech">
          <p>HTML, Bootstrap, JavaScript, Python</p>
        </div>
        <a href="https://cndls.georgetown.edu" className="workBlock__link">View Project</a>
        </div>
      </div>
    </div>

    <div className="workBlock">
      <img className="workBlock__image" src={teachingCommonsScreencap} />
      <div className="workBlock__info">
        <h3 className="workBlock__title">The Teaching Commons</h3>
        <div className="workBlock__blurb">
          <div className="workBlock__description">
          This site is a collection of resources involving the Scholarship of Teaching and Learning built using the Flask static site generator. I contributed to the design for this site, along with writing templates for the pages.
          </div>
        <div className="workBlock__tech">
          <p>Design, HTML, Bootstrap, Python</p>
        </div>
        <a href="https://commons.georgetown.edu/teaching" className="workBlock__link">View Project</a>
        </div>
      </div>
    </div>

    <div className="workBlock">
      <img className="workBlock__image" src={tlisiScreencap} />
      <div className="workBlock__info">
        <h3 className="workBlock__title">TLISI</h3>
        <div className="workBlock__blurb">
          <div className="workBlock__description">
          This is an event site for an annual conference aroud Teaching and Learning that was built in WordPress. I worked with a designer to create a child theme for this site, taking their designs and writing the CSS and PHP to create the site pages.</div>
        <div className="workBlock__tech">
          <p>CSS, WordPress, PHP</p>
        </div>
        <a href="https://tlisi.georgetown.edu/" className="workBlock__link">View Project</a>
        </div>
      </div>
    </div>

    <div className="workBlock">
      <img className="workBlock__image" src={gatsbyScreencap} />
      <div className="workBlock__info">
        <h3 className="workBlock__title">My Site</h3>
        <div className="workBlock__blurb">
          <div className="workBlock__description">
          I created my site using the Gatsby JS static site generator, which uses React JS. I created my own components, layouts, and pages, and used source and transform plugins to pull in Markdown files with GraphQL queries which converted to static pages. I also did the responsive design.
          </div>
        <div className="workBlock__tech">
          <p>Design, React JS, GraphQL, SCSS</p>
        </div>
        <a href="/" className="workBlock__link">View Project</a>
        </div>
      </div>
    </div>

    <div className="workBlock">
      <img className="workBlock__image" src={jsProjects} />
      <div className="workBlock__info">
        <h3 className="workBlock__title">JavaScript Learning</h3>
        <div className="workBlock__blurb">
          <div className="workBlock__description">
          With all of the new frameworks and approaches that exist, I try to focus as much as I can on the fundamentals of JavaScript. I'm going through Wes Bos's JavaScript 30 course, which teaches vanilla JS solutions through fun projects. Check out my <a href="/all-blog-posts/">blog</a> for my writeups.
          </div>
        <div className="workBlock__tech">
          <p>JavaScript</p>
        </div>
        <a href="/all-blog-posts/" className="workBlock__link">View Project</a>
        </div>
      </div>
    </div>

  </div>
);
import React from 'react';
import Link from 'gatsby-link';
import cndlsScreencap from '../assets/img/cndls_screencap.png';
import teachingCommonsScreencap from '../assets/img/teachingcommons_screencap.png';
import tlisiScreencap from '../assets/img/tlisi_screencap.png';
import gatsbyScreencap from '../assets/img/great_gatsby.jpg';
import jsProjects from '../assets/img/js_projects.png';




export default({data}) => (
  <div className="workpageWrapper">
    {data.allWorkJson.edges.map( ({node}, index) => (
      <div className="workBlock">
        <div className="workBlock__image imgSrc"></div>
        <div className="workBlock__info">
          <h3 className="workBlock__title">{node.title}</h3>
          <div className="workBlock__blurb">
            <div className="workBlock__description">{node.description}</div>
            <div className="workBlock__tech">
              <p>{node.tech}</p>
            </div>
            <div className="workBlock__link">
              <a href={node.link}>View Project</a>
            </div>
          </div>
        </div>
      </div>

    ))}
  </div>
);


export const query = graphql`
  query AllWorkQuery {
    allWorkJson {
      edges {
        node {
          title
          description
          tech
          link
        }
      }
    }
  }
`;
import React from 'react';

export default({data}) => {
  // console.log(data);
  return (
  <div>
    <h1>All Files</h1>
    <table>
      <thead>
        <tr>
          <th>name</th>
          <th>relativePath</th>
          <th>extension</th>
          <th>publicURL</th>
        </tr>

      </thead>
      <tbody>
        {data.allFile.edges.map( ({node}, index) =>
          <tr key={index}>
            <td>{node.name}</td>
            <td>{node.relativePath}</td>
            <td>{node.extension}</td>
            <td>{node.publicURL}</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>)
};

export const query = graphql`
  query MyFilesQuery {
    allFile {
      edges {
        node {
          name
          id
          relativePath
          extension
          publicURL
        }
      }
    }
  }
`;
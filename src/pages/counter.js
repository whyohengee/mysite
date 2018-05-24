import React from 'react';
import Link from 'gatsby-link';

class Counter extends React.Component {
  constructor() { //Create and init an obj in the class
    super(); //Access parent methods
    this.state = {count: 0};
  }


  render() {
    return (
      <div>
        <h1>I'm a counter</h1>
        <p>Current count: {this.state.count}</p>
        <button onClick={ () => this.setState({count: this.state.count + 1})}>Plus</button>
        <button onClick={ () => this.setState({count: this.state.count - 1})}>Minus</button>

        <p><Link to="/">Home</Link></p>
      </div>
    )
  }
}

export default Counter;
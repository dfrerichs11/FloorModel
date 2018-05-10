import React, { Component } from 'react';
import './App.css';
import FloorModel from './model';

class App extends Component {
  constructor() {
    super();
    this.state = {
      myModel: new FloorModel(),
    };
  }
  render() {
    return (
      <button onClick={this.state.myModel.runModel}>
      runModel
      </button>
    );
  }
}

export default App;

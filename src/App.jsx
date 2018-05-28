import React, { Component } from 'react';
import './App.css';
import FloorModel from './model';

class App extends Component {
  constructor() {
    super();
    this.runModel = this.runModel.bind(this);
  }
  runModel = () => {
    const model = new FloorModel();
    model.runModel();
  }
  render() {
    return (
      <button onClick={this.runModel}>
      runModel
      </button>
    );
  }
}

export default App;

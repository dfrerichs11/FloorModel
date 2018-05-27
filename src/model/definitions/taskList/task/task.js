import Operation from './operation/operation';

export default class Task {
  constructor(operations) {
    this.operations = operations.map(op => new Operation(op));

    this.availablePaths = this.availablePaths.bind(this);
    this.findPaths = this.findPaths.bind(this);
  }

  // returns an array of paths each represting an available route
  // to complete this task. Each path is itself an array of objects
  // each containing a callback function and a time property that
  // will be added to the action queue
  availablePaths = state => {
    const paths = [];
    const options = this.operations.map(op => op.options(state));
    // now we have a list of lists of options for each operation.
    // we need to create another list that gives each allowable combination
    // of these operation options this can be done recursively
    this.findPaths(paths, [], options);
    // now paths should contain a list of lists with each sub list containing one possible
    // set of options for completing this task. we need to convert this into a format
    // that can be added to the action queue
    return paths.map(path => {
      const actions = [];
      path.forEach(option => {
        option.transitions.forEach(transition => {
          actions.push({
            action: _state => _state.setState(option.ent, transition.state),
            serialCode: state.getStateserialCodemand(
              option.ent,
              transition.state,
              transition.initState,
            ),
            time: transition.time,
          });
          transition.produce.forEach(prod => {
            actions.push({
              action: _state => _state.entityList.entities[option.ent]
                .adjustInventory(prod.material, prod.qty),
              serialCode: state.getInventoryserialCodemand(option.ent, prod.material, prod.qty),
              time: transition.time,
            });
          });
        });
      });
      return actions;
    });
  }

  findPaths = (paths, thisPath, options) => {
    if (options.length === 0) {
      paths.push(thisPath);
      return;
    }
    const nextOptions = options.slice();
    const thisOption = nextOptions.shift();
    thisOption.forEach(option => {
      if (!thisPath.some(path => option.reserved && path.reserved && path.ent === option.ent)) {
        this.findPaths(paths, thisPath.concat([option]), nextOptions);
      }
    });
  }
}

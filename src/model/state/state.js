export default class State {
  constructor(entities) {
    this.entityList = entities;

    this.copy = this.copy.bind(this);
  }

  copy = () => new State(this.entityList.copy());
}

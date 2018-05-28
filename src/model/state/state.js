import ActionQueue from './actionQueue/actionQueue';

export default class State {
  constructor(entities, config, serialCode = '', actionQueue) {
    this.config = config;
    this.entityList = entities;
    this.serialBlockLength = config.serialBlockLength;
    this.actionQueue = actionQueue || new ActionQueue();
    this.actionQueue.attach(this);

    this.copy = this.copy.bind(this);
    this.adjustInventory = this.adjustInventory.bind(this);
    this.setState = this.setState.bind(this);
    this.getInventorySerialCode = this.getInventorySerialCode.bind(this);
    this.getStateSerialCode = this.getStateSerialCode.bind(this);
    this.equals = this.equals.bind(this);
    this.getSerialCode = this.getSerialCode.bind(this);
    this.updateSerialCode = this.updateSerialCode.bind(this);

    this.serialCode = serialCode || this.entityList.entities.map(ent => `0${ent.state.toString(36)}:`
      .substr(ent.state.toString(36).length)
      .concat(ent.inventory.map(mat => `00${mat.toString(36)},`
        .substr(mat.toString(36).length)).join(''))).join('');
  }

  copy = (actions = []) => new State(
    this.entityList.copy(),
    this.config,
    this.serialCode,
    this.actionQueue.copy(actions),
  );

  adjustInventory = (ent, mat, qty) => {
    this.entityList.entities[ent].adjustInventory(mat, qty);
    // this.serialCode = this.getInventorySerialCode(ent, mat, qty);
    this.updateSerialCode();
  }

  setState = (ent, state) => {
    this.entityList.entities[ent].setState(state);
    // this.serialCode = this.getStateSerialCode(ent, state);
    this.updateSerialCode();
  }

  getStateSerialCode = (ent, state) =>
    this.serialCode.substring(0, ent * this.serialBlockLength)
      .concat(`0${state.toString(36)}:`.substr(state.toString(36).length))
      .concat(this.serialCode.substr((ent * this.serialBlockLength) + 2));

  getInventorySerialCode = (ent, mat, qty) =>
    this.serialCode.substring(0, (ent * this.serialBlockLength) + (mat * 3))
      .concat(`00${qty.toString(36)},`.substr(qty.toString(36).length))
      .concat(this.serialCode.substr((ent * this.serialBlockLength) + (mat * 3) + 3));

  updateSerialCode = () => {
    this.serialCode = this.entityList.entities.map(ent => `0${ent.state.toString(36)}:`
      .substr(ent.state.toString(36).length)
      .concat(ent.inventory.map(mat => `00${mat.toString(36)},`
        .substr(mat.toString(36).length)).join(''))).join('');
  }

  equals = state => state.entityList.equals(this.entityList);
  getSerialCode = () => this.serialCode.concat(this.actionQueue.serialCode);
}

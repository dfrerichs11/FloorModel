export default class State {
  constructor(entities, serialCode = 0, keylist, materials) {
    this.entityList = entities;
    this.serialCode = serialCode;

    this.copy = this.copy.bind(this);
    this.adjustInventory = this.adjustInventory.bind(this);
    this.setState = this.setState.bind(this);
    this.getInventoryserialCodemand = this.getInventoryserialCodemand.bind(this);
    this.getStateserialCodemand = this.getStateserialCodemand.bind(this);
    this.equals = this.equals.bind(this);

    this.keylist = keylist || this.entityList.map(() => {
      const keys = {
        ent: Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER / 10000000)),
        mat: (new Array(materials)).map(() =>
          Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER / 10000000))),
      };
      return keys;
    });
  }

  copy = () => new State(this.entityList.copy(), this.serialCode);

  adjustInventory = (ent, mat, qty) => {
    this.entityList.entities[ent].adjustInventory(mat, qty);
    this.serialCode += this.getInventoryserialCodemand(ent, mat, qty);
    this.serialCode = this.serialCode % (Number.MAX_SAFE_INTEGER / 100000);
  }

  setState = (ent, state) => {
    const lastState = this.entityList.entities[ent].state;
    this.entityList.entities[ent].setState(state);
    this.serialCode += this.getStateserialCodemand(ent, state, lastState);
    this.serialCode = this.serialCode % (Number.MAX_SAFE_INTEGER / 100000);
  }

  getStateserialCodemand = (ent, state, lastState) => this.keylist[ent] * (state - lastState);

  getInventoryserialCodemand = (ent, mat, qty) => this.keylist[ent].mat[mat] * qty;

  equals = state => state.entityList.equals(this.entityList);
}


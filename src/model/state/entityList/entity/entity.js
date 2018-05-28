export default class Entity {
  constructor(ent, id) {
    this.state = ent.state;
    this.location = ent.location;
    this.name = ent.name;
    this.groupID = ent.groupID;
    this.inventory = ent.inventory || [];
    this.id = id;

    this.adjustInventory = this.adjustInventory.bind(this);
    this.setLocation = this.setLocation.bind(this);
    this.setState = this.setState.bind(this);
    this.isAvailable = this.isAvailable.bind(this);
    this.copy = this.copy.bind(this);
    this.equals = this.equals.bind(this);
  }
  adjustInventory = (material, qty) => {
    if (this.inventory[material]) {
      this.inventory[material] += qty;
    } else {
      this.inventory[material] = qty;
    }
  }
  setState = state => { if (state !== -1) this.state = state; }

  setLocation = location => { this.location = location; };

  isAvailable = (ids, state, BOM) => {
    const test = (this.state === state || state === -1) && ids.includes(this.groupID)
    && BOM.every(item => this.inventory[item.material] >= item.qty, this);
    return test;
  }
  copy = () => new Entity(
    {
      state: this.state,
      location: { ...this.location },
      name: this.name,
      groupID: this.groupID,
      inventory: this.inventory.slice(),
    },
    this.id,
  );
  equals = entity =>
    entity.state === this.state &&
    entity.location === this.location &&
    entity.inventory.every((mat, i) => mat === this.inventory[i])
}

export default class StorageLocation {
  constructor(inventory, entity) {
    this.inventory = inventory;
    this.entity = entity;
    this.adjustInventory = this.adjustInventory.bind(this);
    this.copy = this.copy.bind(this);
  }

  adjustInventory = (material, qty) => {
    if (this.inventory[material.name]) {
      this.inventory[material.name] += qty;
    } else {
      this.inventory[material.name] = qty;
    }
  }
  copy = () => new StorageLocation({ ...this.inventory }, this.entity);
}

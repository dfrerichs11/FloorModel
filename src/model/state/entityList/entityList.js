import Entity from './entity/entity';

export default class EntityList {
  constructor(entities) {
    this.entities = entities;

    this.addEntity = this.addEntity.bind(this);
    this.getEnts = this.getEnts.bind(this);
    this.copy = this.copy.bind(this);
    this.equals = this.equals.bind(this);
  }

  getEnts = (ids, state, BOM) => this.entities.filter(ent => ent.isAvailable(ids, state, BOM))

  addEntity = (state, location, name, groupID) =>
    this.entities.push(new Entity(state, location, name, groupID))

  copy = () => new EntityList(this.entities.map(ent => ent.copy()))

  equals = entityList => {
    entityList.entities.every((ent, i) => ent.equals(this.entities[i]));
  }
}

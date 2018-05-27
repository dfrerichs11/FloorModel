export default class Operation {
  constructor(op) {
    this.transitions = op.transitions;
    this.groupIds = op.groupIds;
    this.initState = op.initState;
    this.BOM = op.BOM;

    this.options = this.options.bind(this);
  }

  options = state => {
    const avail = state.entityList.getEnts(this.groupIds, this.initState, this.BOM).map(ent =>
      ({
        ent: ent.id,
        transitions: this.transitions,
        reserved: this.initState !== -1,
        initState: this.initState,
      }));
    return avail;
  }
}

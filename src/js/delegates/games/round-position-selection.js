import i18n from "charcoal/services/i18n";

export default class PositionSelectionDelegate {

  constructor(manager, round, position) {
    this.manager = manager;
    this.round = round;
    this.position = position;
  }

  async select(user, callback) {
    const { manager, round, position } = this;

    if(user.empty === true) {
      return setTimeout(callback, 10);
    }

    try {
      await manager.record({ position, user, round });
    } catch (error) {
      console.warn(error);
    }
  }

  options(callback) {
    const { manager, round } = this;
    const { members } = manager;
    const scored = [ round.asshole_id, round.president_id, round.vice_president_id ];
    const options = members.filter(m => scored.indexOf(m.id) === -1);

    if(options.length === 0) {
      options.push({ empty : true });
    }

    callback(options);
  }

  translate(user) {
    const { name : username } = user;

    if(user.empty) {
      return i18n("no_results");
    }

    return username;
  }

}

import rounds_api from "charcoal/resources/game-rounds";
import i18n from "charcoal/services/i18n";

class Delegate {

  constructor(manager) {
    this.manager = manager;
  }

  columns() {
    const { manager } = this;
    const { members } = manager;
    const columns = [
      { name : i18n("round"), rel : "round", classes : [ "is-2" ] }
    ];

    for(let i = 0, c = members.length; i < c; i++) {
      const { name, uuid } = members[i];
      columns.push({ name, rel : uuid });
    }

    return columns;
  }

  async rows(pagination, sorting, callback) {
    const { manager } = this;
    const { game_id } = manager;
    const rows = [ ];
    const where = { game_id };
    const rounds = await rounds_api.query({ where });
    const { total } = rounds.meta;

    if(total >= 1 === false) {
      rows.push({ empty : true });

      return callback({ rows, total });
    }

    for(let i = 0, c = rounds.length; i < c; i++) {
      const round = rounds[i];
      rows.push({ round, manager });
    }

    callback({ rows, total });
  }

}

export default Delegate;

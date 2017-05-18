import rounds_api from "charcoal/resources/game-rounds";
import i18n from "charcoal/services/i18n";

class Delegate {

  constructor(manager) {
    this.manager = manager;
  }

  columns() {
    const columns = [
      { name : i18n("round_no"), rel : "round", classes : [ "is-one-quarter" ] },
      { name : i18n("results"), rel : "results" }
    ];

    return columns;
  }

  async rows(pagination, sorting, callback) {
    const { manager } = this;
    const { game_id } = manager;
    const rows = [ ];
    const where = { game_id };
    const { current : page, size : limit } = pagination;

    const sort_order = sorting && sorting.direction ? "asc" : "desc";
    const sort_on = sorting && sorting.rel === "round" ? "id" : "id";

    const rounds = await rounds_api.query({ where, sort_order, sort_on });

    const { total } = rounds.meta;

    if(total >= 1 === false) {
      rows.push({ empty : true });

      return callback({ rows, total });
    }

    const start = (page || 0) * limit;

    for(let i = 0, c = rounds.length; i < c; i++) {
      const round = rounds[i];
      const number = sorting && sorting.direction ? (start + i + 1) : total - (i + start);
      rows.push({ round, number, manager });
    }

    callback({ rows, total });
  }

}

export default Delegate;

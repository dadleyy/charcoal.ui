import ajax from "charcoal/services/ajax";
import i18n from "charcoal/services/i18n";

class Delegate {

  columns() {
    const columns = [
      { rel : "id" },
      { text : i18n("status"), rel : "game.status" },
      { text : i18n("created_by"), rel : "game.owner" },
      { text : i18n("start_date"), rel : "created" },
      { rel : "actions" }
    ];

    return columns;
  }

  rows(pagination, sorting, callback) {
    const rows = [ ];
    const total = 0;

    ajax.get("/api/game-memberships");

    callback({ rows, total });
  }

}

export default Delegate;

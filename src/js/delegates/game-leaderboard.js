import rounds_api from "charcoal/resources/game-rounds";
import i18n from "charcoal/services/i18n";

class Delegate {

  constructor(manager) {
    this.manager = manager;
  }

  columns() {
    return [
      { name : i18n("name"), rel : "id" },
      { name : i18n("assholes"), rel : "assholes" },
      { name : i18n("presidencies"), rel : "presidencies" },
      { name : i18n("vice_presidencies"), rel : "vice_presidencies" }
    ];
  }

  async rows(pagination, sorting, callback) {
    const { manager } = this;
    const { game_id } = manager;

    const rows = [ ];
    const total = 0;
    const where = { game_id };
    await rounds_api.query({ where });
    callback({ rows, total });
  }

}

export default Delegate;

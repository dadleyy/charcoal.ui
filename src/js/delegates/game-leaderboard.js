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

  rows(pagination, sorting, callback) {
    const rows = [{ empty : true }];
    const total = 0;
    callback({ rows, total });
  }

}

export default Delegate;

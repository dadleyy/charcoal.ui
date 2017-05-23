import i18n from "charcoal/services/i18n";
import user_api from "charcoal/resources/users";

class InvitationsDelegate {

  constructor(game_manager) {
    this.game_manager = game_manager;
  }

  columns() {
    return [
      { name : i18n("user_id"), rel : "id", classes : [ "is-hidden-mobile" ] },
      { name : i18n("name"), rel : "user.name" },
      { rel : "actions", classes : [ "is-one-quarter-mobile" ] }
    ];
  }

  async rows(pagination, sorting, callback) {
    const { game_manager } = this;
    const { current : page, size : limit } = pagination;
    const users = await user_api.query({ page, limit });
    const { total } = users.meta;

    if(total >= 1 !== true) {
      const empty = { empty : true };

      return callback({ rows : [ empty ], total });
    }

    const rows = users.map(user => ({ user, game_manager }));
    callback({ rows, total });
  }

}

export default InvitationsDelegate;

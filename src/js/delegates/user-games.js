import i18n from "charcoal/services/i18n";
import membership_api from "charcoal/resources/game-memberships";
import game_api from "charcoal/resources/games";
import Evented from "charcoal/util/evented";

class RowDelegate {

  constructor(game, membership, signals) {
    this.game = game;
    this.membership = membership;
    this.signals = signals;
  }

  get game_id() {
    const { game } = this;

    return game.uuid;
  }

}

class Cache extends Evented {

  constructor() {
    super(...arguments);
    this.memberships = [ ];
    this.games = [ ];
  }

  get rows() {
    const { games, memberships } = this;

    const update = () => {
      this.trigger("updated");
    };

    function toRow(membership) {
      const [ game ] = games.filter(g => g.id === membership.game_id);
      const delegate = new RowDelegate(game, membership, { update });

      return { membership, game, delegate };
    }

    return memberships.map(toRow);
  }

}

class Delegate {

  constructor(user) {
    this.user = user;
    this.cache = new Cache();
  }

  columns() {
    const columns = [
      { name : i18n("id"), rel : "id", classes : [ "is-1 is-hidden-touch" ] },
      { name : i18n("status"), rel : "game.status" },
      { name : i18n("start_date"), rel : "created", classes : [ "is-5" ] },
      { rel : "actions" }
    ];

    return columns;
  }

  async rows(pagination, sorting, callback) {
    const { user, cache } = this;
    let rows = [ ];
    let total = 0;

    const { current : page, size : limit } = pagination;

    try {
      let where = { user_id : user.id };
      cache.memberships = await membership_api.query({ page, limit, where });
      total = cache.memberships.meta ? cache.memberships.meta.total : 0;

      if(!total) {
        const empty = { empty : true };

        return callback({ rows : [ empty ], total });
      }

      const game_ids = cache.memberships.map(({ game_id }) => game_id);

      where = { id : game_ids };
      cache.games = await game_api.query({ where });

      rows = cache.rows;
    } catch (error) {
      const error_row = { error };
      rows = [ error_row ];

      return callback({ rows });
    }

    callback({ rows, total });
  }

}

export default Delegate;

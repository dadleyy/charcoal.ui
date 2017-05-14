import deferred from "charcoal/services/deferred";
import game_api from "charcoal/resources/games";
import game_membership_api from "charcoal/resources/game-memberships";
import history_api from "charcoal/resources/game-membership-history";
import user_api from "charcoal/resources/users";
import Evented from "charcoal/util/evented";

class Manager extends Evented {

  constructor(game, user) {
    super(...arguments);
    this.game = game;
    this.user = user;
  }

  get game_id() {
    const { game } = this;

    return game.id;
  }

  get members() {
    const { membership_store } = this;

    return membership_store.users;
  }

  get population() {
    const { game } = this;

    return game.population;
  }

  async invite(new_user) {
    const { game_id } = this;
    const { id : user_id } = new_user;
    await game_membership_api.create({ user_id, game_id });
  }

  async refresh() {
    const { game } = this;
    const where = { id : game.id };
    const [ updated_game ] = await game_api.query({ where });

    this.game = updated_game;

    const { game_id } = this;

    await game_membership_api.query({ where : { game_id } });

    const [ memberships, history ] = await deferred.all(
      game_membership_api.query({ where : { game_id } }),
      history_api.query({ where : { game_id } })
    );

    const user_ids = [ ];

    for(let i = 0, c = history.length; i < c; i++) {
      const { user_id } = history[i];
      if(user_ids.indexOf(user_id) === -1) user_ids.push(user_id);
    }

    const user_requests = user_ids.map(id => user_api.query({ where : { id } }));
    const user_responses = await deferred.all(...user_requests);
    const users = user_responses.map(response => response[0]);

    this.membership_store = { memberships, history, users };
  }

}

export default Manager;

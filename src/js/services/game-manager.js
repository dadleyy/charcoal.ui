import deferred from "charcoal/services/deferred";
import game_api from "charcoal/resources/games";
import game_membership_api from "charcoal/resources/game-memberships";
import history_api from "charcoal/resources/game-membership-history";
import user_api from "charcoal/resources/users";
import rounds_api from "charcoal/resources/game-rounds";
import Evented, { ALL_EVENT } from "charcoal/util/evented";
import { PRESIDENT, VICE_PRESIDENT, ASSHOLE } from "charcoal/defs/round-positions";

function positionColumn(position) {
  switch (position) {
  case PRESIDENT:
    return "president_id";
  case ASSHOLE:
    return "asshole_id";
  case VICE_PRESIDENT:
    return "vice_president_id";
  }
}

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

  get refresh_query() {
    const { game } = this;
    const { uuid, id } = game;

    return uuid ? { uuid } : { id };
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
    await this.refresh();
    this.trigger(ALL_EVENT);
  }

  async newRound() {
    const { game_id } = this;
    await rounds_api.create({ game_id });
    await this.refresh();
    this.trigger(ALL_EVENT);
  }

  async clearRound(round, position) {
    const position_id = positionColumn(position);
    const { id } = round;
    await rounds_api.update({ id, [position_id] : null });
    this.trigger(ALL_EVENT);
  }

  async record(updates) {
    const { round, user, position } = updates;
    const { id } = round;
    const { id : user_id } = user;
    const position_id = positionColumn(position);

    await rounds_api.update({ id, [position_id] : user_id });
    this.trigger(ALL_EVENT);
  }

  async refresh() {
    const { refresh_query : where } = this;
    const [ updated_game ] = await game_api.query({ where });
    this.game = updated_game;

    const { game_id } = this;

    const [ memberships, history ] = await deferred.all(
      game_membership_api.query({ where : { game_id } }),
      history_api.query({ where : { game_id } })
    );

    const user_ids = [ ];

    for(let i = 0, c = history.length; i < c; i++) {
      const { user_id } = history[i];
      if(user_ids.indexOf(user_id) === -1) user_ids.push(user_id);
    }

    const users = await user_api.query({ where : { id : user_ids } });

    this.membership_store = { memberships, history, users };
  }

}

export default Manager;

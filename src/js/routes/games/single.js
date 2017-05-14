import auth from "charcoal/services/auth";
import { REQUIRE_AUTH } from "charcoal/defs/route-access";
import { Redirect } from "charcoal/router";
import game_api from "charcoal/resources/games";

async function resolve(GameManager, ScoreboardDelegate, LeaderboardDelegate) {
  const { user } = auth;
  const { params } = this;

  const where = { uuid : params.id };
  const result = { };

  try {
    const [ game ] = await game_api.query({ where });
    result.game = game;
  } catch (e) {
    throw new Redirect("/missing");
  }

  result.manager = new GameManager(result.game, user);

  await result.manager.refresh();

  result.delegates = {
    scoreboard : new ScoreboardDelegate(result.manager),
    leaderboard : new LeaderboardDelegate(result.manager)
  };

  return result;
}

const view = "charcoal/views/games/single";
const path = "games/:id";
const access = REQUIRE_AUTH;

const dependencies = [
  "services/game-manager",
  "delegates/game-scoreboard",
  "delegates/game-leaderboard"
];

export default { resolve, view, path, access, dependencies };


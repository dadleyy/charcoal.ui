import auth from "charcoal/services/auth";
import { REQUIRE_AUTH } from "charcoal/defs/route-access";
import { Redirect } from "charcoal/router";

async function resolve(GameManager, ScoreboardDelegate, LeaderboardDelegate) {
  const { user } = auth;
  const { params } = this;
  const { id : uuid } = params;
  const result = { };

  try {
    result.manager = new GameManager({ uuid }, user);
    await result.manager.refresh();
  } catch (e) {
    throw new Redirect("/missing");
  }

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

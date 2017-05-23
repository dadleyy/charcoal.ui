import auth from "charcoal/services/auth";
import { REQUIRE_AUTH } from "charcoal/defs/route-access";
import { Redirect } from "charcoal/router";

async function resolve(GameManager) {
  const { user } = auth;
  const { params } = this;
  const { id : uuid } = params;

  try {
    const manager = new GameManager({ uuid }, user);
    await manager.refresh();

    return { manager };
  } catch (e) {
    throw new Redirect("/missing");
  }
}

const view = "charcoal/views/games/members";
const path = "games/:id/members";
const access = REQUIRE_AUTH;

const dependencies = [
  "services/game-manager"
];

export default { resolve, view, path, access, dependencies };

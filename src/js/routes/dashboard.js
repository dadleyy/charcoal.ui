import auth from "charcoal/services/auth";
import { REQUIRE_AUTH } from "charcoal/defs/route-access";

function resolve(GamesDelegate) {
  const { user } = auth;
  const games_delegate = new GamesDelegate(user);

  return { user, games_delegate };
}

const view = "charcoal/views/dashboard";
const path = "dashboard";
const dependencies = [
  "charcoal/delegates/user-games"
];

export default { resolve, view, path, dependencies, access : REQUIRE_AUTH };

import auth from "charcoal/services/auth";
import { Redirect } from "charcoal/router";
import GamesDelegate from "charcoal/delegates/user-games";

function resolve() {
  const { user } = auth;

  if(!user) {
    throw new Redirect("/login");
  }

  const games_delegate = new GamesDelegate(user);

  return { user, games_delegate };
}

const view = "charcoal/views/dashboard";
const path = "dashboard";

export default { resolve, view, path };

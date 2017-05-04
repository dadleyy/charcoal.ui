import auth from "charcoal/services/auth";
import { Redirect } from "charcoal/router";

function resolve() {
  const { user } = auth;

  if(!user) {
    throw new Redirect("/login");
  }

  return { user };
}

const view = "charcoal/views/dashboard";
const path = "dashboard";

export default { resolve, view, path };

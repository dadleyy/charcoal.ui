import auth from "charcoal/services/auth";
import { Redirect } from "charcoal/router";

function resolve() {
  const { user } = auth;

  if(user) {
    throw new Redirect("/dashboard");
  }

  return { };
}

const view = "charcoal/views/login";
const path = "login";

export default { resolve, view, path, guest : true };

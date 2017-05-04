import auth from "charcoal/services/auth";
import { PREPARE_AUTH } from "charcoal/defs/route-access";
import { Redirect } from "charcoal/router";

function resolve() {
  const { user } = auth;

  return new Redirect(user ? "/dashboard" : "/login");
}

const path = "/";

export default { resolve, path, access : PREPARE_AUTH };

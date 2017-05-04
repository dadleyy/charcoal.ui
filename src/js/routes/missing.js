import auth from "charcoal/services/auth";
import { PREPARE_AUTH } from "charcoal/defs/route-access";

function resolve() {
  const { user } = auth;

  return { user };
}

const view = "charcoal/views/not-found";
const path = "*";

export default { resolve, view, path, access : PREPARE_AUTH };

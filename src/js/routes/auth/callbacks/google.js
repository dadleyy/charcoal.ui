import auth from "charcoal/services/auth";
import { Redirect } from "charcoal/router";

async function resolve() {
  const { page_context } = this;
  const { querystring } = page_context;
  const token = querystring.get("token");

  const valid = await auth.attempt(token);

  if(!valid) {
    throw new Redirect("/login");
  }

  return { };
}

const view = "charcoal/views/dashboard";
const path = "auth/callbacks/google";

export default { resolve, view, path, guest : true };

import auth from "charcoal/services/auth";
import { Redirect } from "charcoal/router";

async function resolve() {
  const { query } = this;
  const token = query.get("token");

  const valid = await auth.attempt(token);

  if(!valid) {
    throw new Redirect("/login");
  }

  return new Redirect("/dashboard");
}

const path = "auth/callbacks/google";

export default { resolve, path, guest : true };

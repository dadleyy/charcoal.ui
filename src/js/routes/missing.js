import auth from "charcoal/services/auth";

function resolve() {
  const { user } = auth;

  return { user };
}

const view = "charcoal/views/not-found";
const path = "*";

export default { resolve, view, path };

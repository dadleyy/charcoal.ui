import root from "charcoal/routes/root";
import login from "charcoal/routes/login";
import dashboard from "charcoal/routes/dashboard";
import google_auth from "charcoal/routes/auth/callbacks/google";
import missing from "charcoal/routes/missing";
import games from "charcoal/routes/games";

export default [
  root,
  login,
  dashboard,
  google_auth,
  ...games,
  missing
];

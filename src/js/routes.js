import login from "charcoal/routes/login";
import dashboard from "charcoal/routes/dashboard";
import google_auth from "charcoal/routes/auth/callbacks/google";
import missing from "charcoal/routes/missing";

export default [
  login,
  dashboard,
  google_auth,
  missing
];

import React from "react";
import i18n from "charcoal/services/i18n";
import GoogleLogin from "charcoal/components/social/google-login-button";

class Login extends React.Component {

  render() {
    return (
      <div data-role="login-page" className="container">
        <div className="columns">
          <div className="column">
            <h4>{i18n("login")}</h4>
          </div>
          <div className="column">
            <GoogleLogin />
          </div>
        </div>
      </div>
    );
  }

}

export default Login;

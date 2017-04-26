import React from "react";
import i18n from "charcoal/services/i18n";

class Login extends React.Component {

  render() {
    return (
      <div data-role="application-error" className="container">
        <div className="columns">
          <div className="column">
            <h4>{i18n("login")}</h4>
          </div>
          <div className="column">
          </div>
        </div>
      </div>
    );
  }

}

export default Login;

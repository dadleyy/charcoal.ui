import React from "react";
import i18n from "charcoal/services/i18n";
import GoogleLogin from "charcoal/components/social/google-login-button";

class Login extends React.Component {

  render() {
    return (
      <main data-role="login-page" className="container">
        <div className="columns">
          <aside className="column">
            <h4>{i18n("login")}</h4>
            <hr />
            <section data-role="google-login">
              <GoogleLogin />
            </section>
          </aside>
          <aside className="column">
          </aside>
        </div>
      </main>
    );
  }

}

export default Login;

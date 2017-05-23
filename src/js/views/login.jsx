import React from "react";
import GoogleLogin from "charcoal/components/social/google-login-button";

class Login extends React.Component {

  render() {
    return (
      <main data-role="login-page" className="container">
        <section className="columns">
          <aside className="column">
            <section data-role="google-login">
              <GoogleLogin />
            </section>
          </aside>
          <aside className="column">
          </aside>
        </section>
      </main>
    );
  }

}

export default Login;

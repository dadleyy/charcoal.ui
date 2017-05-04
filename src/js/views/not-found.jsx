import React from "react";
import i18n from "charcoal/services/i18n";

class NotFound extends React.Component {

  render() {
    const { resolution } = this.props;

    const action = resolution.user ? <a href="/">{i18n("home")}</a> : <a href="/login">{i18n("login")}</a>;

    return (
      <main data-role="not-found">
        <section className="container">
          <p>{i18n("page_not_found")}</p>
          <div data-role="not-found-action">{action}</div>
        </section>
      </main>
    );
  }
}

export default NotFound;

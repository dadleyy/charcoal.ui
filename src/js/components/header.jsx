import React from "react";
import i18n from "charcoal/services/i18n";
import Auth, { EVENTS } from "charcoal/services/auth";
import UserMenu from "charcoal/components/user-menu";

class Header extends React.Component {

  constructor() {
    super(...arguments);
    const auth = Auth.on(EVENTS.USER_AUTHENTICATED, this.forceUpdate, this);
    this.listeners = { auth };
  }

  componentWillUnmount() {
    const { listeners } = this;
    Auth.off(listeners.auth);
  }

  render() {
    const { user } = Auth;
    const user_menu = user ? <UserMenu /> : null;

    return (
      <nav className="nav has-shadow">
        <div className="container">
          <aside className="nav-left">
            <a className="nav-item is-brand" href="/" title={i18n("charcoal")}>
              <img src="http://bulma.io/images/bulma-logo.png" alt="bulma-logo" />
            </a>
          </aside>
          <aside className="nav-right nav-menu">{user_menu}</aside>
        </div>
      </nav>
    );
  }

}

export default Header;

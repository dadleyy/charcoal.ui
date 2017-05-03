import React from "react";
import i18n from "charcoal/services/i18n";
import Auth from "charcoal/services/auth";
import UserMenu from "charcoal/components/user-menu";

class Header extends React.Component {

  constructor() {
    super(...arguments);
    this.listeners = { };
  }

  componentWillUnmount() {
    const { listeners } = this;
    Auth.off(listeners.auth);
  }

  render() {
    const { user } = Auth;
    const user_menu = user ? <UserMenu /> : null;

    return (
      <main className="application-header">
        <div className="application-header__container">
          <aside className="application-header__branding">
            <div className="application-header__branding-logo">
              <h4>{i18n("charcoal")}</h4>
            </div>
          </aside>
          <aside className="application-header__user-menu">{user_menu}</aside>
        </div>
      </main>
    );
  }

}

export default Header;

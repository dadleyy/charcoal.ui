import React from "react";
import i18n from "charcoal/services/i18n";
import config from "charcoal/config/environment";

class UserMenu extends React.Component {

  render() {
    const { routing } = config;

    return (
      <main className="user-menu nav-right nav-menu">
        <a className="nav-item is-tab">{i18n("account")}</a>
        <a className="nav-item is-tab" rel="external" href={routing.logout_url}>{i18n("sign_out")}</a>
      </main>
    );
  }

}

export default UserMenu;

import React from "react";
import i18n from "charcoal/services/i18n";

class UserMenu extends React.Component {

  render() {
    return (
      <main className="user-menu">
        <a className="nav-item is-tab">{i18n("account")}</a>
        <a className="nav-item is-tab">{i18n("sign_out")}</a>
      </main>
    );
  }

}

export default UserMenu;

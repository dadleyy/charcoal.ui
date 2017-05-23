import React from "react";
import i18n from "charcoal/services/i18n";
import iconMenu from "charcoal/components/macro/icon-menu";

class Body extends React.Component {

  render() {
    const { props } = this;
    const { delegate, close } = props;
    const { game_id } = delegate;
    const options = [
      <li key="view"><a href={`/games/${game_id}`} onClick={close}>{i18n("view_game")}</a></li>
    ];

    return (
      <div data-role="membership-menu" className="popup-menu">
        <ul className="menu-list">{options}</ul>
      </div>
    );
  }

}

export default iconMenu(Body);

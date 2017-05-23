import React from "react";
import i18n from "charcoal/services/i18n";
import { PlusIcon } from "charcoal/components/micro/icons";
import MembershipManagement from "charcoal/components/games/membership-management";

export default class GameMembers extends React.Component {

  render() {
    const { resolution } = this.props;
    const { manager } = resolution;
    const { game_id } = manager;

    return (
      <main data-game-id={game_id} className="container">
        <section className="conainer">
        </section>
        <section className="card">
          <header className="card-header">
            <p className="card-header-title ">{i18n("members")}</p>
            <a className="card-header-icon" title={i18n("new_member")}><PlusIcon /></a>
          </header>
          <section data-role="game-table" className="card-content padding-0-touch">
            <MembershipManagement manager={manager} />
          </section>
        </section>
      </main>
    );
  }

}

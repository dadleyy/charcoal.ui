import React from "react";
import utils from "hoctable/utils";
import i18n from "charcoal/services/i18n";
import * as STATUSES from "charcoal/defs/statuses";
import modals from "charcoal/services/modals";
import MembershipManagement from "charcoal/components/games/membership-management";
import responsive from "charcoal/components/macro/responsive-content";

function control(content) {
  const uuid = utils.uuid();

  return (<div className="is-pulled-left" key={uuid}>{content}</div>);
}

export default class Controls extends React.Component {

  componentWillUnmount() {
    const { modal_id } = this;
    modals.close(modal_id);
  }

  render() {
    const { manager } = this.props;
    const { game } = manager;

    const invite = () => {
      const title = i18n("invite_players");
      const body = <MembershipManagement manager={manager} />;
      this.modal_id = modals.open(body, title);
    };

    const newRound = async () => {
      try {
        return await manager.newRound();
      } catch (e) {
        console.warn(`failed: ${e}`);
      }
    };

    if(game.status !== STATUSES.ACTIVE) {
      return (<main data-role="game-controls"></main>);
    }

    const invites = responsive({
      desktop : <a className="button" onClick={invite}>{i18n("add_players")}</a>,
      mobile : <a className="button" href={`/games/${game.uuid}/members`}>{i18n("add_players")}</a>
    });

    const rounds = control(<a className="button margin-left-5" onClick={newRound}>{i18n("new_round")}</a>);

    const controls = [ control(invites), rounds ];

    return (
      <main data-role="game-controls">
        <section className="is-clearfix">{controls}</section>
        <input type="hidden" value={manager.game_id} data-role={i18n("game_id")} />
      </main>
    );
  }

}

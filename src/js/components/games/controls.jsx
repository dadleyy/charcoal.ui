import React from "react";
import utils from "hoctable/utils";
import i18n from "charcoal/services/i18n";
import * as STATUSES from "charcoal/defs/statuses";
import modals from "charcoal/services/modals";
import InvitationTable from "charcoal/components/games/invitation-table";
import InvitationsDelegate from "charcoal/delegates/game-invitations";

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
      const invitation_delegate = new InvitationsDelegate(manager);
      const body = <InvitationTable delegate={invitation_delegate} />;
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

    const controls = [
      control(<a className="button" onClick={invite}>{i18n("add_players")}</a>),
      control(<a className="button margin-left-5" onClick={newRound}>{i18n("new_round")}</a>)
    ];

    return (
      <main data-role="game-controls">
        <section className="is-clearfix">{controls}</section>
        <input type="hidden" value={manager.game_id} data-role={i18n("game_id")} />
      </main>
    );
  }

}

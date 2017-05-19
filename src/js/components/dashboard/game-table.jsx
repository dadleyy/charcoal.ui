import React from "react";
import { hoc } from "hoctable";
import moment from "moment";
import i18n from "charcoal/services/i18n";
import { CircleIcon } from "charcoal/components/micro/icons";
import StatusTag from "charcoal/components/micro/status-tag";
import GameMembershipMenu from "charcoal/components/dashboard/membership-menu";
import responsive from "charcoal/components/macro/responsive-content";

const { Grid : grid } = hoc;

function errored(error) {
  return (
    <article className="columns bordered" data-role="game-row--error">
      <aside className="column">
        <p>{i18n("something_went_wrong")}</p>
        <input type="hidden" value={error.toString()} data-role="error-value" />
      </aside>
    </article>
  );
}

function empty() {
  return (
    <article data-role="game-row--empty">
      <aside className="column"><p>{i18n("no_results")}</p></aside>
    </article>
  );
}

class Row extends React.Component {

  render() {
    const { props } = this;
    const { row } = props;

    if(row.empty) {
      return empty();
    }

    if(row.error) {
      return errored(row.error);
    }

    const { game } = row;

    const status = responsive({
      desktop : (
        <StatusTag status={game.status}>
          <span className="is-hidden-mobile">{game.id}:</span>
          <span className="is-hidden-mobile">{game.status}</span>
        </StatusTag>
      ),
      mobile : (<CircleIcon />)
    });

    const creation = responsive({
      mobile : (<p>{moment(game.created_at).fromNow()}</p>),
      desktop : (<p>{moment(game.created_at).fromNow()}</p>)
    });

    return (
      <main data-role="game-row" className="grid-row is-mobile" data-game-id={game.uuid}>
        <aside data-role="game-id" className="column is-1 is-hidden-touch">
          <p>{game.id}</p>
        </aside>
        <aside data-role="game-status" className="column">{status}</aside>
        <aside data-role="game-creation" className="column is-5">{creation}</aside>
        <aside data-role="actions" className="has-text-centered column is-1-touch">
          <div className="display-inline-block">
            <GameMembershipMenu delegate={row.delegate} />
          </div>
        </aside>
      </main>
    );
  }

}

export default grid(Row);

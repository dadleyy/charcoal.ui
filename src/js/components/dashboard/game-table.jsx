import React from "react";
import { hoc } from "hoctable";
import moment from "moment";
import i18n from "charcoal/services/i18n";
import StatusTag from "charcoal/components/micro/status-tag";
import GameMembershipMenu from "charcoal/components/dashboard/membership-menu";

const { Table : table } = hoc;

function errored(error) {
  return (
    <tr className="game-row" data-role="game-row--error">
      <td colSpan="5">
        <p>{i18n("something_went_wrong")}</p>
        <input type="hidden" value={error.toString()} data-role="error-value" />
      </td>
    </tr>
  );
}

function empty() {
  return (
    <tr className="game-row" data-role="game-row--empty">
      <td colSpan="5"><p>{i18n("no_results")}</p></td>
    </tr>
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

    return (
      <tr className="game-row" data-role="game-row">
        <td data-role="game-id">
          <p>{game.id}</p>
        </td>
        <td data-role="game-status">
          <StatusTag status={game.status}><p>{game.status}</p></StatusTag>
        </td>
        <td data-role="game-creation">
          <p>{moment(game.created_at).fromNow()}</p>
        </td>
        <td data-role="actions" className="align-center">
          <div className="display-inline-block">
            <GameMembershipMenu delegate={row.delegate} />
          </div>
        </td>
      </tr>
    );
  }

}

export default table(Row);

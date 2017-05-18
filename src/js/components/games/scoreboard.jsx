import React from "react";
import { hoc } from "hoctable";
import i18n from "charcoal/services/i18n";

const { Grid : grid } = hoc;

function empty() {
  return (
    <article data-role="empy-game" className="grid-row">
      <aside className="column"><p>{i18n("no_rounds")}</p></aside>
    </article>
  );
}

class ScoreboardRow extends React.Component {

  render() {
    const { row } = this.props;

    if(row.empty) {
      return empty();
    }

    const { number, round } = row;

    return (
      <article data-role="leaderboard-row" className="grid-row is-mobile" data-round={round.uuid}>
        <aside className="column is-one-quarter">{number}</aside>
        <aside className="column"></aside>
      </article>
    );
  }

}

export default grid(ScoreboardRow);

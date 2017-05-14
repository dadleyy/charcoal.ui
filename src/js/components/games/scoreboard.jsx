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

    return (
      <article data-role="leaderboard-row">
      </article>
    );
  }

}

export default grid(ScoreboardRow);

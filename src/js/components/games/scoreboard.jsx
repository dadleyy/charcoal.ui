import React from "react";
import { hoc } from "hoctable";
import i18n from "charcoal/services/i18n";
import { PRESIDENT, VICE_PRESIDENT, ASSHOLE } from "charcoal/defs/round-positions";
import RoundPositionControl from "charcoal/components/games/round-position-control";
import responsive from "charcoal/components/macro/responsive-content";

import { CircleIcon, CircleThinIcon, TimesIcon, HashtagIcon } from "charcoal/components/micro/icons";

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

    const { number, round, manager } = row;

    return (
      <article data-role="leaderboard-row" className="grid-row is-mobile" data-round={round.uuid}>
        <aside className="column">{number}</aside>
        <aside className="column" data-column="president">
          <RoundPositionControl round={round} manager={manager} position={PRESIDENT} />
        </aside>
        <aside className="column" data-column="vice_president">
          <RoundPositionControl round={round} manager={manager} position={VICE_PRESIDENT} />
        </aside>
        <aside className="column" data-column="asshole">
          <RoundPositionControl round={round} manager={manager} position={ASSHOLE} />
        </aside>
      </article>
    );
  }

}

class Column extends React.Component {

  render() {
    const { column } = this.props;
    const content = { label : i18n(column.rel) };

    switch (column.rel) {
    case "president":
      content.icon = <CircleIcon />;
      break;
    case "vice_president":
      content.icon = <CircleThinIcon />;
      break;
    case "asshole":
      content.icon = <TimesIcon />;
      break;
    case "round":
      content.icon = <HashtagIcon />;
      content.label = i18n("round_no");
      break;
    }

    const desktop = <p>{content.label}</p>;
    const mobile = <div className="is-flex justify-content-center align-items-center">{content.icon}</div>;

    return responsive({ desktop, mobile });
  }

}

export default grid(ScoreboardRow, Column);

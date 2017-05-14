import React from "react";
import i18n from "charcoal/services/i18n";
import Message from "charcoal/components/macro/message";
import Scoreboard from "charcoal/components/games/scoreboard";
import Leaderboard from "charcoal/components/games/leaderboard";
import Controls from "charcoal/components/games/controls";

function LowPop() {
  const body = <p>{i18n("low_game_population")}</p>;

  return (<Message>{body}</Message>);
}

export default class SingleGame extends React.Component {

  render() {
    const { props } = this;
    const { resolution } = props;
    const { manager, delegates } = resolution;

    const flash_messages = [ ];

    if(manager.population < 4) {
      flash_messages.push(<LowPop key="low-pop"/>);
    }

    return (
      <main className="container">
        <section data-role="flash-messages" className="margin-bottom-5">{flash_messages}</section>
        <section data-role="game-controls" className="margin-bottom-5"><Controls manager={manager} /></section>
        <section className="columns is-gapless">
          <aside className="column">
            <Scoreboard delegate={delegates.scoreboard} />
          </aside>
          <aside className="column is-5 margin-left-10">
            <Leaderboard delegate={delegates.leaderboard} />
          </aside>
        </section>
      </main>
    );
  }

}

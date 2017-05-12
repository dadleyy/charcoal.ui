import React from "react";
import i18n from "charcoal/services/i18n";
import GameTable from "charcoal/components/dashboard/game-table";
import games from "charcoal/resources/games";

class Dashboard extends React.Component {

  render() {
    const { resolution } = this.props;
    const { games_delegate } = resolution;

    const createGame = async () => {
      const game = await games.create();

      this.setState({ game });
    };

    return (
      <main data-role="dashboard-view" className="container">
        <section className="columns">
          <aside className="is-one-quarter column">
            <div className="card">
              <header className="card-header">
                <section className="level">
                  <aside className="level-left">
                    <p className="card-header-title">{i18n("welcome_x", resolution.user.name)}</p>
                  </aside>
                </section>
              </header>
            </div>
          </aside>
          <aside className="is-three-quarters column">
            <div className="card">
              <header className="card-header">
                <p className="card-header-title ">{i18n("your_games")}</p>
                <a className="card-header-icon" onClick={createGame} title={i18n("new_game")}>
                  <span className="icon">
                    <i className="fa-plus fa" />
                  </span>
                </a>
              </header>
              <section data-role="game-table" className="card-content">
                <GameTable delegate={games_delegate} />
              </section>
            </div>
          </aside>
        </section>
      </main>
    );
  }
}

export default Dashboard;

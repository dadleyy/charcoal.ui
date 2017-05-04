import React from "react";
import i18n from "charcoal/services/i18n";
import GameTable from "charcoal/components/dashboard/game-table";

class Dashboard extends React.Component {

  render() {
    const { resolution } = this.props;
    const { games_delegate } = resolution;

    return (
      <main data-role="dashboard-view" className="container">
        <section className="container columns">
          <aside className="is-one-quarter column">
            <div className="card">
              <header className="card-header">
                <p className="card-header-title">{i18n("welcome_x", resolution.user.name)}</p>
              </header>
            </div>
          </aside>
          <aside className="is-three-quarters column">
            <div className="card">
              <header className="card-header">
                <p className="card-header-title">{i18n("your_games")}</p>
              </header>
              <section data-role="game-table">
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

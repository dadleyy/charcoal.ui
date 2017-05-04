import React from "react";
import i18n from "charcoal/services/i18n";

class Dashboard extends React.Component {

  render() {
    const { resolution } = this.props;

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
            </div>
          </aside>
        </section>
      </main>
    );
  }
}

export default Dashboard;

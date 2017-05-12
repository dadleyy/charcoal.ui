import React from "react";
import { hoc } from "hoctable";

const { Menu : menu } = hoc;

class Button extends React.Component {

  render() {
    return (
      <main className="icon-menu-button">
        <a className="button">
          <span className="icon">
            <i className="fa-bars fa" />
          </span>
        </a>
      </main>
    );
  }

}

function factory(Body) {
  return menu(Body, Button);
}

export default factory;

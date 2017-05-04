import React from "react";
import { hoc } from "hoctable";

const { Table : table } = hoc;

class Row extends React.Component {

  render() {
    return (
      <tr className="game-row" data-role="game-role">
      </tr>
    );
  }

}

export default table(Row);

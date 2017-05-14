import React from "react";
import { hoc } from "hoctable";

const { Grid : grid } = hoc;

class Leaderboard extends React.Component {

  render() {
    return (
      <article data-role="leaderboard-row">
      </article>
    );
  }

}

export default grid(Leaderboard);

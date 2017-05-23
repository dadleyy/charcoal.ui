import React from "react";
import { hoc } from "hoctable";
import i18n from "charcoal/services/i18n";
import CheckIcon from "charcoal/components/micro/icons/check";
import PlusIcon from "charcoal/components/micro/icons/plus";

const { Grid : grid } = hoc;

function Invited() {
  return (<CheckIcon />);
}

function AddUser(props) {
  const { user, manager } = props;

  async function add() {
    await manager.invite(user);
  }

  return (
    <div className="button-container">
      <a className="button" onClick={add}><PlusIcon /></a>
    </div>
  );
}

function empty() {
  return (
    <article className="grid-row">
      <aside className="column"><p>{i18n("no_results")}</p></aside>
    </article>
  );
}

class InvitationRow extends React.Component {

  render() {
    const { row } = this.props;

    if(row.empty) {
      return empty();
    }

    const { game_manager, user } = row;
    const { members } = game_manager;
    const is_member = members.some(u => u.id === user.id);
    const control = is_member ? <Invited /> : <AddUser user={user} manager={game_manager} />;

    return (
      <article className="grid-row">
        <aside className="column is-hidden-mobile"><p>{user.id}</p></aside>
        <aside className="column text-overflow-ellipsis"><p>{user.name}</p></aside>
        <aside className="column is-one-quarter-mobile has-text-centered is-paddingless">{control}</aside>
      </article>
    );
  }

}

export default grid(InvitationRow);

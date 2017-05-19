import React from "react";

export default class UserIcon extends React.Component {

  render() {
    const { manager } = this.props;
    const { user, initials } = manager;

    return (
      <main className="" data-user-id={user.uuid}>
        <article className="is-hidden-mobile"><p>{user.name}</p></article>
        <article className="is-hidden-desktop"><p>{initials}</p></article>
      </main>
    );
  }

}

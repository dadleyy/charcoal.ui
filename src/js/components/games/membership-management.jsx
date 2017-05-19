import React from "react";
import InvitationTable from "charcoal/components/games/invitation-table";
import InvitationsDelegate from "charcoal/delegates/game-invitations";

class MembershipManagement extends React.Component {

  constructor({ manager }) {
    super(...arguments);
    this.manager = manager;
    this.invitation_delegate = new InvitationsDelegate(manager);
  }

  componentDidMount() {
    const { manager } = this;
    const updates = manager.all(this.forceUpdate, this);
    this.subscriptions = { updates };
  }

  componentWillUnmount() {
    const { manager, subscriptions } = this;
    manager.off(subscriptions.updates);
  }

  render() {
    const { invitation_delegate } = this;

    return (
      <main className="membership-management">
        <section className="controls">
        </section>
        <section className="table"><InvitationTable delegate={invitation_delegate} /></section>
      </main>
    );
  }
}

export default MembershipManagement;


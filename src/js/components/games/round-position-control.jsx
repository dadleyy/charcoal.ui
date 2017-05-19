import React from "react";
import { PRESIDENT, VICE_PRESIDENT, ASSHOLE } from "charcoal/defs/round-positions";
import responsive from "charcoal/components/macro/responsive-content";

import { TimesIcon } from "charcoal/components/micro/icons";
import UserManager from "charcoal/services/user-manager";
import Avatar from "charcoal/components/user-icon";

import PositionSelectionDelegate from "charcoal/delegates/games/round-position-selection";
import PositionMenu from "charcoal/components/games/round-position-menu";

export default class RoundPositionControl extends React.Component {

  constructor() {
    super(...arguments);
    const { manager } = this.props;
    const updates = manager.all(this.forceUpdate, this);
    this.subscriptions = { updates };
  }

  componentWillUnmount() {
    const { subscriptions, props } = this;
    props.manager.off(subscriptions.updates);
  }

  render() {
    const { round, manager, position } = this.props;
    let position_user_reference;

    switch (position) {
    case PRESIDENT:
      position_user_reference = round.president_id;
      break;
    case VICE_PRESIDENT:
      position_user_reference = round.vice_president_id;
      break;
    case ASSHOLE:
      position_user_reference = round.asshole_id;
      break;
    }

    const { members } = manager;
    const [ user ] = members.filter(u => u.id === position_user_reference);

    if(!user) {
      const delegate = new PositionSelectionDelegate(manager, round, position);
      const mobile = <PositionMenu delegate={delegate} />;
      const desktop = null;

      return responsive({ mobile, desktop });
    }

    async function clearPosition() {
      try {
        await manager.clearRound(round, position);
      } catch (e) {
        console.warn(e);
      }
    }

    const user_manager = new UserManager(user);
    const desktop = null;
    const mobile = (
      <section className="has-text-centered is-clearfix">
        <article><Avatar manager={user_manager} /></article>
        <article><a className="link" onClick={clearPosition}><TimesIcon size="small" /></a></article>
      </section>
    );

    return responsive({ mobile, desktop });
  }

}

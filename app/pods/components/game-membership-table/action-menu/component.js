import Ember from 'ember';

const className = 'game-membership-table__action-menu';

const actions = {

  destroy() {
    const membership = this.get('membership');
    console.log(membership);
  }

};

export default Ember.Component.extend({ className, actions });

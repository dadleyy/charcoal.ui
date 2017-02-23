import Ember from 'ember';
import ENV from 'charcoal/config/environment';

const { API_HOME } = ENV;
const { inject } = Ember;

const actions = {

  createGame() {
    const delegate = this.get('model.table_delegate');
    const route = `${API_HOME}/games`;
    const method = 'POST';

    function move() {
      delegate.set('state', { updated: Date.now() });
    }

    return this.get('ajax').request(route, { method }).then(move);
  }

};

export default Ember.Controller.extend({ ajax: inject.service(), actions });

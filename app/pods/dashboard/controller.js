import Ember from 'ember';
import ENV from 'charcoal/config/environment';

const { API_HOME } = ENV;
const { inject } = Ember;

const actions = {

  createGame() {
    const route = `${API_HOME}/games`;
    const method = 'POST';
    const set = this.set.bind(this);

    function move() {
      set('count', Date.now());
    }

    return this.get('ajax').request(route, { method }).then(move);
  }

};

export default Ember.Controller.extend({ ajax: inject.service(), actions });

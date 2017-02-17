import Ember from 'ember';
import AuthenticatedRoute from 'charcoal/mixins/authenticated-route';

function beforeModel() {
  const auth = this.get('auth');
  const deferred = this.get('deferred');
  const replace = this.replaceWith.bind(this);

  function validate() {
    const user = auth.get('user');

    if(user) {
      return deferred.resolve();
    }

    return replace('login');
  }

  return this._super(...arguments).finally(validate);
}
export default Ember.Mixin.create(AuthenticatedRoute, { beforeModel });

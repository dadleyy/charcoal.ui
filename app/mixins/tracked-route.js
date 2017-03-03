import Ember from 'ember';

const { Mixin, inject } = Ember;

function activate() {
  const { fullRouteName: title } = this;
  const page = '/' + title.replace('.', '/');
  this.get('analytics').page(page, { title, page });
}

export default Mixin.create({
  analytics: inject.service(),
  activate
});

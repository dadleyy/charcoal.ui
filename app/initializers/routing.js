export function initialize(application) {
  application.inject('route', 'deferred', 'service:deferred');
  application.inject('route', 'auth', 'service:auth');
  application.inject('route', 'ajax', 'service:ajax');
}

export default {
  name: 'routing',
  initialize
};

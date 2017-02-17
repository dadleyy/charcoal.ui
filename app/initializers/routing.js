export function initialize(application) {
  application.inject('route', 'deferred', 'service:deferred');
  application.inject('route', 'auth', 'service:auth');
}

export default {
  name: 'routing',
  initialize
};

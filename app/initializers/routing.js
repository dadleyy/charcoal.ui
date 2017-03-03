export function initialize(application) {
  application.inject('route', 'deferred', 'service:deferred');
  application.inject('route', 'auth', 'service:auth');
  application.inject('route', 'ajax', 'service:ajax');
  application.inject('route', 'i18n', 'service:i18n');
  application.inject('route', 'analytics', 'service:analytics');
}

export default {
  name: 'routing',
  initialize
};

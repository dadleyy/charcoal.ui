import Ember from 'ember';
import config from 'charcoal/config/environment';

const { get, RSVP: deferred } = Ember;
var GAInitializer, initialize;

function setup() {
  const { tracking_id } = get(config, 'google') || { };
  ga('create', tracking_id, 'auto');
  this.lookup('service:analytics').ready();
}

initialize = function (application) {
  const { tracking_id } = get(config, 'google') || { };

  if(!tracking_id) {
    return;
  }

  const script = document.createElement('script');
  const sibling = document.getElementsByTagName('script')[0];
  script.type = 'text/javascript';
  script.async = true;
  script.src = 'https://www.google-analytics.com/analytics.js';
  script.onload = setup.bind(application);

  return sibling.parentNode.insertBefore(script, sibling);
};

GAInitializer = {
  name: 'google-analytics',
  initialize: initialize
};

export { initialize };

export default GAInitializer;

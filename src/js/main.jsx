/* global document */

import { services } from "hoctable";

import routes from "charcoal/routes";
import router from "charcoal/router";
import config from "charcoal/config/environment";

export function bootstrap() {
  const popups = document.getElementById("popups");
  services.Viewport.bind();
  services.Popups.mount(popups);

  for(let i = 0, c = routes.length; i < c; i++) {
    const route = routes[i];
    router.register(route);
  }

  if(popups) {
    popups.go();
  }

  router.start(config.routing);
}

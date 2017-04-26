/* global document */

import { services } from "hoctable";

import React from "react";
import ReactDOM from "react-dom";

import ErrorView from "charcoal/views/error";

import i18n from "charcoal/services/i18n";
import routes from "charcoal/routes";
import router from "charcoal/router";
import config from "charcoal/config/environment";

export async function bootstrap() {
  const popups = document.getElementById("popups");
  const main = document.getElementById("main");

  services.Viewport.bind();
  services.Popups.mount(popups);

  for(let i = 0, c = routes.length; i < c; i++) {
    const route = routes[i];
    router.register(route);
  }

  try {
    await i18n.set("en");
  } catch (error) {
    const error_view = React.createElement(ErrorView, { error });

    return ReactDOM.render(error_view, main);
  }

  router.start(config.routing);
}

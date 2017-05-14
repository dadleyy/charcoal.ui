/* global document */

import { services } from "hoctable";

import React from "react";
import ReactDOM from "react-dom";

import Header from "charcoal/components/header";
import ErrorView from "charcoal/views/error";

import modals from "charcoal/services/modals";
import i18n from "charcoal/services/i18n";
import routes from "charcoal/routes";
import router from "charcoal/router";
import config from "charcoal/config/environment";
import layers from "charcoal/defs/document-layers";

export async function bootstrap() {
  services.Viewport.bind();
  services.Popups.mount(layers.popups);
  modals.mount(layers.modals);

  for(let i = 0, c = routes.length; i < c; i++) {
    const route = routes[i];
    router.register(route);
  }

  try {
    await i18n.set("en");
  } catch (error) {
    const error_view = React.createElement(ErrorView, { error });

    return ReactDOM.render(error_view, layers.main);
  }

  const header = React.createElement(Header, { });
  ReactDOM.render(header, layers.header);
  router.start(config.routing);
}

/* globals document, require */

import React from "react";
import ReactDOM from "react-dom";

import page from "page";
import * as ACCESS_LEVELS from "charcoal/defs/route-access";
import isEsModule from "charcoal/util/is-es-module";
import auth from "charcoal/services/auth";
import ErrorView from "charcoal/views/error";
import querystring from "charcoal/services/querystring";

let view_mount = null;

export class Redirect extends Error {

  constructor(url) {
    super(...arguments);
    this.redirect_url = url;
  }

}

const router = {

  register(definition) {
    const { resolve, path, view, dependencies } = definition;

    const stack = [ ];

    function render(ViewModule) {
      const [ latest ] = stack;
      const { resolution } = latest;
      const ViewClass = isEsModule(ViewModule) ? ViewModule.default : ViewModule;
      const instance = React.createElement(ViewClass, { resolution });

      // Remove oldest route from stack
      stack.splice(1, 1);

      return ReactDOM.render(instance, view_mount);
    }

    async function inject(...resolved_dependencies) {
      const [ latest, previous ] = stack;

      const deps = resolved_dependencies.map(module => module.default);

      try {
        latest.resolution = await resolve.apply(latest, [ ...deps, previous ]);
      } catch (e) {
        const is_redirect = e instanceof Redirect || e.redirect_url;
        console.warn(`unable to load ${path}: ${e}`);

        latest.resolution = { error : e };

        return is_redirect ? page(e.redirect_url) : render(ErrorView);
      }

      const { resolution } = latest;

      if(resolution && resolution.redirect_url || resolution instanceof Redirect) {
        const { redirect_url } = latest.resolution;

        return page(redirect_url);
      }

      require([ view ], render);
    }

    function failed(err) {
      console.warn(`error resolving route[${err}]`);

      return page("/login");
    }

    function go(page_context) {
      const query = querystring(page_context.querystring);
      const { params } = page_context;

      stack.push({ page_context, query, params });

      if(dependencies && dependencies.length) {
        return require(dependencies, inject, failed);
      }

      return inject();
    }

    async function begin(page_context) {
      const { access } = definition;

      if(access & ACCESS_LEVELS.ALLOW_GUEST) {
        return go(page_context);
      }

      try {
        await auth.prep();
      } catch (e) {

        if(access & ACCESS_LEVELS.REQUIRE_AUTH) {
          return page("/login");
        }
      }

      return go(page_context);
    }

    page(path, begin);
  },

  start(options = { }) {
    const { base_url } = options;

    if(base_url) {
      page.base(base_url);
    }

    view_mount = document.getElementById("main");
    page.start({
      hashbang : options.hashbang === true,
      popstate : options.popstate !== false,
      click : true
    });
  },

  stop() {
    page.stop();
    page.callbacks.length = 0;
  }

};

export default router;


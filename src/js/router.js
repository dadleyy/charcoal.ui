/* globals document, require */

import page from "page";
import auth from "charcoal/services/auth";
import React from "react";
import ReactDOM from "react-dom";

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

    function render(ViewClass) {
      const [ latest ] = stack;
      const { resolution } = latest;
      const instance = React.createElement(ViewClass.default, { resolution });

      // Remove oldest route from stack
      stack.splice(1, 1);

      return ReactDOM.render(instance, view_mount);
    }

    async function inject(...resolved_dependencies) {
      const [ latest, previous ] = stack;

      try {
        latest.resolution = await resolve.apply(latest, [ ...resolved_dependencies, previous ]);
      } catch (e) {
        return e instanceof Redirect || e.redirect_url ? page(e.redirect_url) : page("/error");
      }

      require([ view ], render);
    }

    function failed(err) {
      console.warn(`error resolving route[${err}]`);

      return page("/login");
    }

    function go(page_context) {
      stack.push({ page_context });

      if(dependencies && dependencies.length) {
        return require(dependencies, inject, failed);
      }

      return inject();
    }

    async function begin(page_context) {
      const { guest } = definition;

      if(guest) {
        return go(page_context);
      }

      try {
        await auth.prep();
      } catch (e) {
        return page("/login");
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


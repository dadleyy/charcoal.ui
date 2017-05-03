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
    const { resolve, path, view } = definition;
    const stack = [ ];

    function render(ViewClass) {
      const [ latest ] = stack;
      const { resolution } = latest;
      const instance = React.createElement(ViewClass.default, { resolution });

      // Remove oldest route from stack
      stack.splice(1, 1);

      return ReactDOM.render(instance, view_mount);
    }

    async function inject(...dependencies) {
      const [ latest, previous ] = stack;

      try {
        latest.resolution = await resolve.call(latest, [ ...dependencies, previous ]);
      } catch (e) {
        return e instanceof Redirect || e.redirect_url ? page(e.redirect_url) : page("/error");
      }

      require([ view ], render);
    }

    async function begin(page_context) {
      const { guest } = definition;

      try {
        await auth.prep();
      } catch (e) {
        if(guest !== true) return page("/login");
      }

      stack.push({ page_context });
      const dependencies = resolve.$inject && resolve.$inject.length ? resolve.$inject : [ ];

      return dependencies.length ? require([ dependencies ], inject) : inject();
    }

    page(path, begin);
  },

  start(options = { }) {
    const { base_url } = options;

    if(base_url) {
      page.base(base_url);
    }

    view_mount = document.getElementById("main");
    page.start({ popstate : true, click : true });
  },

  stop() {
    page.stop();
  }

};

export default router;


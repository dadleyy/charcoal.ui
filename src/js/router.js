/* globals require */

import page from "page";
import auth from "charcoal/services/auth";

const router = {

  register(definition) {
    const { resolve, path } = definition;
    const stack = [ ];

    function inject(...dependencies) {
      const [ latest, previous ] = stack;
      resolve.call(latest, [ ...dependencies, previous ]);
    }

    async function begin(page_context) {
      try {
        await auth.prep();
      } catch (e) {
        if(definition.guest !== true) return page("/login");
      }

      stack.push({ page_context });
      const dependencies = resolve.$inject && resolve.$inject.length ? resolve.$inject : [ ];

      require([ dependencies ], inject);
    }

    page(path, begin);
  },

  start(options) {
    const { base_url } = options;

    if(base_url) {
      page.base(base_url);
    }

    page({ popstate : true, click : true });
  }

};

export default router;

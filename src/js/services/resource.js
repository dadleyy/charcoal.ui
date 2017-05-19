import ajax from "charcoal/services/ajax";
import uriTemplate from "uri-templates";

const WITHIN_DELIMETER = ",";

const queryTransforms = {

  request(input = { }) {
    const { where, ...query_params } = input;
    const filter = { };

    for(const key in where) {
      const value = where[key];

      if(value instanceof Array) {
        filter[key] = `in(${value.join(WITHIN_DELIMETER)})`;
        continue;
      }

      filter[key] = `eq(${value})`;
    }

    return { ...query_params, filter };
  },

  response(response) {
    const { meta, results } = response;

    results.meta = meta;

    return results;
  }

};

export const DEFAULT_ACTIONS = [{
  name : "query",
  method : "get",
  transforms : queryTransforms,
  flags : { exclude_template_params : true }
}, {
  name : "update",
  method : "patch",
  flags : { ajax_options : { dataType : "json" } }
}, {
  name : "create",
  method : "post",
  flags : { ajax_options : { dataType : "json" } }
}];

export const DEFAULT_TRANSFORMS = {
  request(input) {
    return input;
  },

  response(result) {
    return result;
  }
};

function exclude(obj, key_list) {
  const result = { };

  for(const key in obj) {
    if(key_list.indexOf(key) !== -1) continue;
    result[key] = obj[key];
  }

  return result;
}

function action(url_template, method, transforms = DEFAULT_TRANSFORMS, flags = { }) {
  const { response : transformResponse, request : transformRequest } = transforms;
  const template = uriTemplate(url_template);
  const { varNames : template_params } = template;

  async function execute(parameters, user_options) {
    let body = transformRequest(parameters);
    const url = template.fill(parameters);

    if(flags.exclude_template_params) {
      body = exclude(body, template_params);
    }

    const ajax_options = { ...flags.ajax_options, ...user_options };

    const result = await ajax[method](url, body, ajax_options);

    return transformResponse(result);
  }

  return execute;
}

function factory(url_template, cusom_actions = [ ]) {
  const api = { };
  const actions = DEFAULT_ACTIONS.concat(cusom_actions);

  for(let i = 0, c = actions.length; i < c; i++) {
    const { name, method, url, transforms, flags } = actions[i];
    api[name] = action(url || url_template, method, transforms, flags);
  }

  return api;
}

export default factory;

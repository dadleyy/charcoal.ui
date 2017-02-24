import Ember from 'ember';

const { Service, inject } = Ember;

function encodeUriQuery(val, pctEncodeSpaces) {
  return encodeURIComponent(val)
    .replace(/%40/gi, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
}

function encodeUriSegment(val) {
  return encodeUriQuery(val, true)
    .replace(/%26/gi, '&')
    .replace(/%3D/gi, '=')
    .replace(/%2B/gi, '+');
}

function path(uri, params = {}) {
  const PROTOCOL_AND_IPV6_REGEX = /^https?:\/\/\[[^\]]*][^/]*/;

  let url = uri;
  const urlParams = {};
  let encodedVal;
  let protocolAndIpv6 = '';

  url.split(/\W/).forEach((param) => {
    if (param === 'hasOwnProperty') {
      throw Error('badname', 'hasOwnProperty is not a valid parameter name.');
    }
    if (!(new RegExp('^\\d+$').test(param)) && param &&
      (new RegExp(`(^|[^\\\\]):${param}(\\W|$)`).test(url))) {
      urlParams[param] = {
        isQueryParamValue: (new RegExp(`\\?.*=:${param}(?:\\W|$)`)).test(url),
      };
    }
  });

  url = url.replace(/\\:/g, ':');
  url = url.replace(PROTOCOL_AND_IPV6_REGEX, (match) => {
    protocolAndIpv6 = match;
    return '';
  });

  Object.keys(urlParams).forEach((urlParam) => {
    const val = params[urlParam];
    const paramInfo = urlParams[urlParam];
    if (typeof val !== 'undefined' && val !== null) {
      if (paramInfo.isQueryParamValue) {
        encodedVal = encodeUriQuery(val, true);
      } else {
        encodedVal = encodeUriSegment(val);
      }
      url = url.replace(new RegExp(`:${urlParam}(\\W|$)`, 'g'), (match, p1) => encodedVal + p1);
    } else {
      url = url.replace(new RegExp(`(/?):${urlParam}(\\W|$)`, 'g'), (match, leadingSlashes, tail) => {
        if (tail.charAt(0) === '/') {
          return tail;
        }
        return leadingSlashes + tail;
      });
    }
  });

  // strip trailing slashes and set the url (unless this behavior is specifically disabled)
  url = url.replace(/\/+$/, '') || '/';

  url = protocolAndIpv6 + url.replace(/\/\\\./, '/.');

  return url;
}

const actions = [
  { name: 'query',   method: 'get', transform: { request: buildFilter } },
  { name: 'create',  method: 'post', transform: { request: buildJson } },
  { name: 'update',  method: 'patch', transform: { request: buildJson } },
  { name: 'del',     method: 'delete' }
];

function buildJson({ data }) {
  const headers = { 'content-type': 'application/json' };
  data = JSON.stringify(data);
  return { data, headers };
}

function buildFilter({ data: body, headers }) {
  let result = { };


  if(!body || !body.where) {
    return result;
  }

  let { where, ...rest } = body;

  for(let key in where) {
    let value = where[key];

    let op = 'eq';

    if(value instanceof Array) {
      op = 'in';
      value = value.join(',');
    }

    if(value.gt) {
      op = 'gt';
      value = value.gt;
    }

    if(value.like) {
      op = 'lk';
      value = value.like;
    }

    if(value.lt) {
      op = 'lt';
      value = value.lt;
    }

    result[`filter[${key}]`] = `${op}(${value})`;
  }

  return { data: Ember.merge(rest, result), headers };
}

function Factory(url_path) {
  let config = { ajax: inject.service(), deferred: inject.service() };

  function action(http_method, transform) {
    const { response: transform_response, request: transform_request } = transform || { };
    let ajax_method = null;

    switch(http_method.toLowerCase()) {
      case 'get':
        ajax_method = 'request';
        break;
      case 'delete':
        ajax_method = 'del';
        break;
      case 'patch':
        ajax_method = 'patch';
        break;
      case 'post':
        ajax_method = 'post';
        break;
    }

    if(ajax_method == null) {
      throw new Error(`invalid http method for resource - ${http_method}`);
    }

    function run(request_data) {
      let ajax = this.get('ajax');
      let deferred = this.get('deferred');
      let headers = { };
      let data = request_data;
      let payload = { data, headers };
      let request_path = path(url_path, data);

      if(typeof transform_request === 'function') {
        payload = transform_request({ headers, data });
      }

      function loaded(result) {
        let r = typeof transform_response === 'function' ? transform_response(result) : result;

        if(r && typeof r.then === 'function') {
          return r;
        }

        return deferred.resolve(r);
      }

      return ajax[ajax_method](request_path, payload).then(loaded);
    }

    return run;
  }

  for(let i = 0, c = actions.length; i < c; i++) {
    let { name, method, transform } = actions[i];
    config[name] = action(method, transform);
  }

  return Service.extend(config);
}

export default Factory;

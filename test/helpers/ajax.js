const { Ajax: jasmine_ajax } = jasmine;

class Request {

  constructor(jasmine_request) {
    const { url, method } = jasmine_request;
    this.url = url;
    this.method = method;
    this.jasmine_request = jasmine_request;
  }

  get raw_url() {
    const { url } = this;
    return decodeURIComponent(url);
  }

  send(body, status = 200) {
    const { jasmine_request } = this;
    const text = JSON.stringify(body);
    jasmine_request.respondWith({ responseText: text, status });
  }

}

const requests = {

  get latest() {
    const most_recent = jasmine_ajax.requests.mostRecent();
    return most_recent ? new Request(most_recent) : null;
  },

  get latest_url() {
    return requests.latest.url;
  }

};

const ajax = {

  requests,

  install() {
    jasmine_ajax.install();
  },

  uninstall() {
    jasmine_ajax.uninstall();
  },

};

export default ajax;

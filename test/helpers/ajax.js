const { Ajax: jasmine_ajax } = jasmine;

class Request {

  constructor(jasmine_request) {
    const { url } = jasmine_request;
    this.url = url;
    this.jasmine_request = jasmine_request;
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
    return new Request(most_recent);
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

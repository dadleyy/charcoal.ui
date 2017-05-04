let internals = { };

function create({ tag = "div", id}) {
  const ele = document.createElement(tag);
  ele.setAttribute("id", id);
  return ele;
}

const dom = {

  setup() {
    const main = create({ id: "main" });
    const header = create({ id: "header" });
    const footer = create({ id: "footer" });

    document.body.appendChild(main);
    document.body.appendChild(header);
    document.body.appendChild(footer);

    internals = { main, header, footer };
  },

  teardown() {
    const { main, header, footer } = internals;
    document.body.removeChild(main);
    document.body.removeChild(header);
    document.body.removeChild(footer);
  },

  get view() {
    return internals.main;
  },

  find(selector) {
    return dom.view.querySelectorAll(selector);
  }

};

export default dom;

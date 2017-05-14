function find(id) {
  return document.getElementById(id);
}

export default {

  get popups() {
    return find("popups");
  },

  get main() {
    return find("main");
  },

  get modals() {
    return find("modals");
  },

  get header() {
    return find("header");
  }

};

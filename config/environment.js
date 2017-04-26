const env = {
  api_root: process.env["API_ROOT"] || "/api",
  locale_root: "/assets/locales",

  routing: {
    base_url: "/"
  }
};

module.exports = {

  get contents() {
    const json = JSON.stringify(env);
    return `module.exports = ${json};`;
  }

};

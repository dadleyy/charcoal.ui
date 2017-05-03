const api_root = process.env["API_ROOT"] || "/api";

const env = {
  api_root,

  locale_root: "/assets/locales",

  oauth: {
    google_url: `${api_root}/login/google`
  },

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

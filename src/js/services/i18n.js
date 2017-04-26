import ajax from "charcoal/services/ajax";
import env from "charcoal/config/environment";

const config = { storage : {} };

function i18n(lookup_path) {
  const { current } = config;
  const parts = lookup_path.split(".");
  let dictionary = config.storage[current];

  while(parts.length && dictionary) {
    const next = parts.shift();
    dictionary = dictionary[next];
  }

  return dictionary;
}

i18n.set = async function(locale) {
  const url = `${env.locale_root}/${locale}.json`;
  const result = await ajax.get(url);
  config.storage[locale] = result;
  config.current = locale;
};

export default i18n;

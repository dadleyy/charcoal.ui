import ajax from "charcoal/services/ajax";
import env from "charcoal/config/environment";

export const PLACEMENT_REGEX = /{{(\d+)}}/g;

const config = { storage : {} };

function i18n(lookup_path, ...placements) {
  const { current } = config;
  const parts = lookup_path.split(".");
  let dictionary = config.storage[current];

  while(parts.length && dictionary) {
    const next = parts.shift();
    dictionary = dictionary[next];
  }

  if(!dictionary) {
    return lookup_path;
  }

  function replace(match, index_value) {
    const index = parseInt(index_value, 10);

    return placements[index] || "";
  }

  return dictionary.replace(PLACEMENT_REGEX, replace);
}

i18n.set = async function(locale) {
  const url = `${env.locale_root}/${locale}.json`;
  const result = await ajax.get(url);
  config.storage[locale] = result;
  config.current = locale;
};

export default i18n;

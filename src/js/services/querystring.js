export const PARAMETER_DELIMETER = "&";
export const PARAMETER_VALUE_SEPARATOR = "=";

const { URLSearchParams } = window;

function shim(string) {
  const parts = string.split(PARAMETER_DELIMETER);
  const result = { };

  for(let i = 0, c = parts.length; i < c; i++) {
    const [ key, value ] = parts[i].split(PARAMETER_VALUE_SEPARATOR);
    result[key] = value;
  }

  function lookup(key) {
    return result[key];
  }

  return { get : lookup };
}

export default function parse(string) {
  return URLSearchParams ? new URLSearchParams(string) : shim(string);
}

const MODULE_IDENTIFIER = "__esModule";
const hasOwn = Object.prototype.hasOwnProperty;

export default function isEsModule(thing) {
  return thing && hasOwn.call(thing, MODULE_IDENTIFIER);
}

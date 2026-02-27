// function getters (instance) {
//   return Object.entries(
//     Object.getOwnPropertyDescriptors(Reflect.getPrototypeOf(instance))
//   )
//   .filter(e => typeof e[1].get === 'function' && e[0] !== '__proto__')
//   .map(e => e[0]);
// }
//

function getters(obj) {
  const getters = new Set();
  let proto = obj;

  while (proto !== null) {
    // Get all property names from the current prototype
    const props = Object.getOwnPropertyNames(proto);

    for (const prop of props) {
      // Use Object.getOwnPropertyDescriptor to check if it's a getter
      const descriptor = Object.getOwnPropertyDescriptor(proto, prop);
      if (descriptor && typeof descriptor.get === 'function' && prop !== 'constructor') {
        getters.add(prop);
      }
    }

    // Move up the prototype chain
    proto = Object.getPrototypeOf(proto);
  }
  getters.delete('__proto__');

  return Array.from(getters);
}

const DONT_EXPORT = ['stars', '_mainWorld', '_mainWorldHostGG', 'dataKey'];

const toJSON = (obj, ancestors = new WeakSet()) => {
  if (typeof obj !== 'object' || obj === null) return obj;

  if (ancestors.has(obj)) return null;
  ancestors.add(obj);

  let result;

  if (Array.isArray(obj)) {
    result = obj.map((element) => toJSON(element, ancestors));
  } else {
    const json = {};

    for (const key in obj)
      if (!DONT_EXPORT.includes(key)) if (Object.prototype.hasOwnProperty.call(obj, key)) json[key] = toJSON(obj[key], ancestors);

    for (const key of getters(obj)) if (!DONT_EXPORT.includes(key)) json[key] = toJSON(obj[key], ancestors);

    if (typeof obj.safeJumpTime === 'function') json['safeJumpTime'] = toJSON(obj.safeJumpTime(4), ancestors);

    result = json;
  }

  ancestors.delete(obj);
  return result;
};

module.exports = toJSON;

function getters (instance) {
  return Object.entries(
    Object.getOwnPropertyDescriptors(Reflect.getPrototypeOf(instance))
  )
  .filter(e => typeof e[1].get === 'function' && e[0] !== '__proto__')
  .map(e => e[0]);
}

DONT_EXPORT = ['stars', '_mainWorld', 'currentNativeSophont', 'extinctNativeSophont'];

const toJSON = (obj) => {
  if (typeof obj !== 'object' || obj === null)
    return obj;

  if (Array.isArray(obj))
    return obj.map((element) => toJSON(element));

  const json = {};

  for (const key in obj)
    if (!DONT_EXPORT.includes(key))
      if (obj.hasOwnProperty(key))
        json[key] = toJSON(obj[key]);

  for (const key of getters(obj))
    if (!DONT_EXPORT.includes(key))
      json[key] = toJSON(obj[key]);

  if (typeof obj.safeJumpTime === 'function')
    json['safeJumpTime'] = toJSON(obj.safeJumpTime(4));

  return json;
}

module.exports = toJSON;

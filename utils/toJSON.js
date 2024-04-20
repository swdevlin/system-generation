function getters (instance) {
  return Object.entries(
    Object.getOwnPropertyDescriptors(Reflect.getPrototypeOf(instance))
  )
  .filter(e => typeof e[1].get === 'function' && e[0] !== '__proto__')
  .map(e => e[0]);
}

const toJSON = (obj) => {
  if (typeof obj !== 'object' || obj === null)
    return obj;

  if (Array.isArray(obj))
    return obj.map((element) => toJSON(element));

  const json = {};

  for (const key in obj)
    if (obj.hasOwnProperty(key))
      json[key] = toJSON(obj[key]);

  for (const key of getters(obj))
    json[key] = toJSON(obj[key]);

  return json;
}

module.exports = toJSON;

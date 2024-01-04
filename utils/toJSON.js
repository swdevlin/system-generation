const toJSON = (obj) => {
  if (typeof obj !== 'object' || obj === null)
    return obj;

  if (Array.isArray(obj))
    return obj.map((element) => toJSON(element));

  const json = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      json[key] = toJSON(obj[key]);
    }
  }

  return json;
}

module.exports = toJSON;

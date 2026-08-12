const hasEmptyGovernmentTypes = (obj) =>
  Array.isArray(obj?.governmentTypes) && obj.governmentTypes.length === 0;

module.exports = { hasEmptyGovernmentTypes };
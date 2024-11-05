const Star = require("./star");
const subtypeLookup = require("../lookups/subtypeLookup");
const hotStarLookup = require("../lookups/hotStarLookup");
const specialStarTypeLookup = require("../lookups/specialStarTypeLookup");

const generateBaseStar = ({dm, classification}) => {
  if (!stellarClass)
    stellarClass = '';

  if (!stellarType)
    stellarType = stellarTypeLookup(0);

  if (stellarType === 'special') {
    const s= specialStarTypeLookup({dm: 0});
    stellarClass = s.stellarClass;
    stellarType = s.stellarType;
  } else if (stellarType === 'hot') {
    stellarClass = 'V';
    stellarType = hotStarLookup({stellarClass: stellarClass});
  } else {
    if (!stellarClass)
      stellarClass = 'V';
  }

  if (!subtype)
    subtype = subtypeLookup(true, stellarType, stellarClass);

  return new Star(classification, orbitType);
};

module.exports = generateBaseStar;


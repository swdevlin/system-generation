const {twoD6, percentageChance} = require("../dice");

const otherStarLookup = ({primary, unusualChance}) => {
  const dm = primary.stellarClass === 'III' || primary.stellarClass === 'IV' ? -1 : 0

  const roll = twoD6() + dm;

  if (roll <= 2) {
    if (percentageChance(unusualChance))
      return 'NS';
    else
      return 'D';
  } else if (roll <= 7)
    return 'D';
  else
    return 'BD';
}

module.exports = otherStarLookup;

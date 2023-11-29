const {twoD6} = require("../dice");
const otherStarLookup = require("./otherStarLookup");

const secondaryStarLookup = ({primary, unusualChance}) => {
  const dm = primary.stellarClass === 'III' || primary.stellarClass === 'IV' ? -1 : 0
  const roll = twoD6() + dm;
  if (roll <= 3)
    return otherStarLookup({primary: primary, unusualChance: unusualChance});
  else if (roll <= 6) {
    return 'Random';
  } else if (roll <= 8) {
    return 'Lesser';
  } else if (roll <= 10) {
    return 'Sibling';
  } else {
    return 'Twin';
  }
}

module.exports = secondaryStarLookup;

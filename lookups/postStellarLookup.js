const {twoD6} = require("../dice");
const otherStarLookup = require("./otherStarLookup");

const postStellarLookup = ({primary, unusualChance}) => {
  const dm = primary.stellarClass === 'III' || primary.stellarClass === 'IV' ? -1 : 0
  const roll = twoD6() + dm;
  if (roll <= 3)
    return otherStarLookup({primary: primary, unusualChance: unusualChance});
  else if (roll <= 8) {
    return 'Random';
  } else if (roll <= 10) {
    return 'Lesser';
  } else {
    return 'Twin';
  }
}

module.exports = postStellarLookup;

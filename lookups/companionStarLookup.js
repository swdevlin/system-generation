const {twoD6} = require("../dice");
const otherStarLookup = require("./otherStarLookup");

const companionStarLookup = ({primary, unusualChance}) => {
  const dm = primary.stellarClass === 'III' || primary.stellarClass === 'IV' ? -1 : 0
  const roll = twoD6() + dm;
  if (roll <= 3)
    return otherStarLookup({primary: primary, unusualChance: unusualChance});
  else if (roll <= 5)
    return 'Random';
  else if (roll <= 7)
    return 'Lesser';
  else if (roll <= 9)
    return 'Sibling';
  else
    return 'Twin';
}

module.exports = companionStarLookup;

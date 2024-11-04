const {twoD6, percentageChance} = require("../dice");


const starTypeLookup = (dm, unusualChance) => {
  const roll = twoD6() + dm;

  if (roll <= 2)
    return specialLookup(dm, unusualChance);
  else if (roll >= 12)
    return hotLookup(dm);
  else
    switch (roll) {
      case 3:
      case 4:
      case 5:
      case 6:
        return {stellarClass: 'V', stellarType: 'M'};
      case 7:
      case 8:
        return {stellarClass: 'V', stellarType: 'K'};
      case 9:
      case 10:
        console.log('starTypeLookup X');
        return {stellarClass: 'V', stellarType: 'G'};
      case 11:
        return {stellarClass: 'V', stellarType: 'F'};
    }
}

const determinePrimaryStarType = (unusualChance) => {
  if (!unusualChance)
    unusualChance = 0;
  return starTypeLookup(0, unusualChance);
}


module.exports = determinePrimaryStarType;

const {twoD6} = require("../dice");

const giantsLookup = (dm) => {
  const roll = twoD6() + dm;
  let stellarClass;
  if (roll <= 8)
    stellarClass = 'III';
  else if (roll <= 10)
    stellarClass = 'II';
  else if (roll <= 11)
    stellarClass = 'Ib';
  else
    stellarClass = 'Ia';
  return stellarClass;
}

module.exports = giantsLookup;

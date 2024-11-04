const {twoD6} = require("../dice");

const hotStarLookup = ({stellarClass}) => {
  const roll = twoD6();

  let type;
  switch (roll) {
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      type = (stellarClass === 'VI') ? 'B' : 'A';
      break;
    case 10:
    case 11:
      type = 'B';
      break;
    case 12:
      type = (stellarClass === 'IV') ? 'B' : 'O';
      break;
  }

  return type;
}

module.exports = hotStarLookup;

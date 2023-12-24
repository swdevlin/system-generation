const {twoD6, d6, threeD6} = require("../dice");

const inclination = () => {
  let inc = 0;
  let roll = twoD6();
  switch (roll) {
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      inc = d6() / 2;
      break;
    case 7:
      inc = d6();
      break;
    case 8:
      inc = twoD6();
      break;
    case 9:
      inc = twoD6() * 3 + d6();
      break;
    case 10:
      inc = (d6()+2)*5;
      break;
    case 11:
      inc = threeD6()+5 - d6();
      break;
    case 12:
      inc = 90 + inclination();
      break;
  }
  return inc;
}

module.exports = inclination;

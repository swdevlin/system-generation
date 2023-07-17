const Random = require("random-js").Random;

r = new Random();

const stellarTypeLookup = (dm) => {
  const roll = r.die(6) + r.die(6) + dm;
  if (roll <= 2)
    return 'Special';
  else if (roll >= 12)
    return 'Hot';
  else
    switch (roll) {
      case 3:
      case 4:
      case 5:
      case 6:
        return 'M';
      case 7:
      case 8:
        return 'K';
      case 9:
      case 10:
        return 'G';
      case 11:
        return 'F';
      case 11:
        return 'F';
    }
}

const hotLookup = (dm) => {
  const roll = r.die(6) + r.die(6) + dm;
  if (roll <= 9)
    return 'A';
  else if (roll <= 11)
    return 'B';
  else
    return 'O';
}

const subtypeLookup = (isPrimary, stellarType, stellarClass) => {
  const roll = r.die(6) + r.die(6);
  let subtype;
  if (isPrimary && stellarType === 'M')
    switch (roll) {
      case  2:
        subtype = 8;
        break;
      case  3:
        subtype = 6;
        break;
      case  4:
        subtype = 5;
        break;
      case  5:
        subtype = 4;
        break;
      case  6:
        subtype = 0;
        break;
      case  7:
        subtype = 2;
        break;
      case  8:
        subtype = 1;
        break;
      case  9:
        subtype = 3;
        break;
      case 10:
        subtype = 5;
        break;
      case 11:
        subtype = 7;
        break;
      case 12:
        subtype = 9;
        break;
    }
  else
    switch (roll) {
      case  2:
        subtype = 0;
        break;
      case  3:
        subtype = 1;
        break;
      case  4:
        subtype = 3;
        break;
      case  5:
        subtype = 5;
        break;
      case  6:
        subtype = 7;
        break;
      case  7:
        subtype = 9;
        break;
      case  8:
        subtype = 8;
        break;
      case  9:
        subtype = 6;
        break;
      case 10:
        subtype = 4;
        break;
      case 11:
      	subtype = 2;
      	break;
      case 12:
        subtype = 0;
        break;
    }
  if (stellarClass === 'IV' && stellarType === 'K' && subtype > 5)
    subtype -= 5;
  return subtype;
}

const generateStar = (dm) => {
  let star = '';
  let stellarClass = '';
  let stellarType = stellarTypeLookup(0);
  if (stellarType === 'Special') {

  } else if (stellarType === 'Hot') {
    stellarType = hotLookup(0);
    stellarClass = 'V';
  } else {
    stellarClass = 'V';
  }
  const subtype = subtypeLookup(true, stellarType, stellarClass);

};

export default generateStar;

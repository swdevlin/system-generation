const {twoD6} = require("../dice");
const terrestrialCompositionDM = require("./terrestrialCompositionDM");

// We allow passing in the dm for testing purposes
const terrestrialComposition = (star, planet, dm) => {
  dm = dm ? dm : terrestrialCompositionDM(star, planet);

  const roll = twoD6() + dm;

  if (roll <= -4 )
    return 'Exotic Ice';
  else if (roll <= 2 )
    return 'Mostly Ice';
  else if (roll <= 6 )
    return 'Mostly Rock';
  else if (roll <= 11 )
    return 'Rock and Metal';
  else if (roll <= 14 )
    return 'Mostly Metal';
  else
    return 'Compressed Metal';
};

module.exports = terrestrialComposition;

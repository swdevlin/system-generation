const StarColour = require("./starColour");
const {generateBaseStar} = require("./generateBaseStar");
const multiStellarBase = require("./multiStellarBase");
const starMass = require("./starMass");
const starDiameter = require("./starDiameter");
const starTemperature = require("./starTemperature");
const minimumAllowableOrbit = require("./minimumAllowableOrbit");
const calculateStarEccentricity = require("./calculateStarEccentricity");
const Random = require("random-js").Random;

const r = new Random();

const generateStar = (primary, dm, isCompanion) => {
  let star;
  if (primary)
    star = multiStellarBase(primary);
  else
    star = generateBaseStar(dm);

  star.mass = starMass(star);

  star.diameter = starDiameter(star);

  star.temperature = starTemperature(star);

  const mainSequenceLifespan = 10/(star.mass**2.5);
  if (star.stellarClass === 'III') {
    star.age = mainSequenceLifespan;
    star.age += mainSequenceLifespan / (4/star.mass);
    star.age += mainSequenceLifespan / (10 * star.mass**3) * r.die(100)/100;
  } else if (star.stellarClass === 'IV') {
    star.age = mainSequenceLifespan / (4/star.mass);
    star.age = mainSequenceLifespan + star.age * r.die(100)/100;
  } else if (star.mass > 0.9) {
    star.age = mainSequenceLifespan * (r.die(6)-1/(r.die(6)/6))/6;
  } else {
    star.age = r.die(6)*2/(r.die(3) + r.die(10)/10);
  }
  if (star.mass < 4.7 && star.age < 0.01)
    star.age = 0.01;
  star.age = Math.round(star.age * 100) / 100;

  star.luminosity= star.diameter**2 + (star.temperature/5772)**4;
  if (star.luminosity > 10)
    star.luminosity = Math.round(star.luminosity);
  else
    star.luminosity =  Math.round(star.luminosity * 100) / 100;

  star.colour = StarColour[star.stellarType];

  star.minimumAllowableOrbit = minimumAllowableOrbit(star);
  if (primary || isCompanion)
    star.eccentricity = calculateStarEccentricity(star);
  else
    star.eccentricity = 0;

  star.availableOrbits = [];

  return star;
};

module.exports = generateStar;

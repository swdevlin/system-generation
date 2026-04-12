const { twoD6, d6 } = require('../dice');

const assignDiversity = (planet) => {
  const pcr = planet.population.concentrationRating;
  const pop = planet.population.code;
  const gov = planet.government.code;
  const law = planet.lawLevelCode;

  let diversity = twoD6();

  if (pop <= 5) diversity -= 2;
  else if (pop >= 9) diversity += 2;

  if (gov <= 2) diversity += 1;
  else if (gov === 7) diversity += 1;
  else if (gov >= 13) diversity -= 4;

  if (law <= 4) diversity += 1;
  else if (law >= 10) diversity -= 1;

  if (pcr <= 3) diversity += 1;
  else if (pcr >= 7) diversity -= 2;

  planet.population.diversity = Math.max(diversity, 1);
};

const assignXenophilia = (planet) => {
  const pop = planet.population.code;
  const gov = planet.government.code;
  const law = planet.lawLevelCode;
  const div = planet.population.diversity;
  const starport = planet.starPort;

  let xenophilia = twoD6();

  if (pop <= 5) xenophilia -= 1;
  else if (pop >= 9) xenophilia += 2;

  if (gov === 13 || gov === 14) xenophilia -= 2;

  if (law >= 10) xenophilia -= 2;

  if (starport === 'A') xenophilia += 2;
  else if (starport === 'B') xenophilia += 1;
  else if (starport === 'D') xenophilia -= 1;
  else if (starport === 'E') xenophilia -= 2;
  else if (starport === 'X') xenophilia -= 4;

  if (div <= 3) xenophilia -= 2;
  else if (div >= 12) xenophilia += 1;

  planet.population.xenophilia = Math.max(xenophilia, 1);
};

const assignUniqueness = (planet) => {
  const div = planet.population.diversity;
  const starport = planet.starPort;
  const xeno = planet.population.xenophilia;

  let uniqueness = twoD6();
  if (starport === 'A') uniqueness -= 2;
  else if (starport === 'B') uniqueness -= 1;
  else if (starport === 'D') uniqueness += 1;
  else if (starport === 'E') uniqueness += 2;
  else if (starport === 'X') uniqueness += 4;

  if (div <= 3) uniqueness += 2;

  if (xeno >= 12) uniqueness -= 2;
  else if (xeno >= 9) uniqueness -= 1;

  planet.population.uniqueness = Math.max(uniqueness, 1);
};

const assignSymbology = (planet) => {
  const gov = planet.government.code;
  const tl = planet.techLevel;
  const u = planet.techLevel;

  let symbology = twoD6();

  if (gov === 13 || gov === 14) symbology += 2;

  if (tl <= 1) symbology -= 3;
  else if (tl <= 3) symbology -= 1;
  else if (tl >= 9 || tl <= 11) symbology += 2;
  else if (tl >= 12) symbology += 4;

  if (u >= 9 && u <= 11) symbology += 1;
  if (u >= 12) symbology += 3;

  planet.population.symbology = Math.max(symbology, 1);
};

const assignCohesion = (planet) => {
  const gov = planet.government.code;
  const law = planet.lawLevelCode;
  const pcr = planet.population.concentrationRating;
  const diversity = planet.population.diversity;

  let cohesion = twoD6();

  if (gov === 3 || gov === 12) cohesion += 2;
  else if (gov === 5 || gov === 6 || gov === 9) cohesion += 1;

  if (law <= 2) cohesion -= 2;
  else if (law >= 10) cohesion += 2;

  if (pcr <= 3) cohesion -= 2;
  else if (pcr >= 7) cohesion += 2;

  if (diversity <= 2) cohesion += 4;
  else if (diversity <= 5) cohesion += 2;
  else if (diversity >= 9 || diversity <= 11) cohesion -= 2;
  else if (diversity >= 12) cohesion -= 4;

  planet.population.cohesion = Math.max(cohesion, 1);
};

const assignMilitancy = (planet) => {
  const gov = planet.government.code;
  const law = planet.lawLevelCode;
  const xeno = planet.population.xenophilia;
  const expansionism = planet.population.expansionism;

  let militancy = twoD6();

  if (gov >= 10) militancy += 3;

  if (law >= 9 && law <= 11) militancy += 1;
  else if (law >= 12) militancy += 2;

  if (xeno <= 5) militancy += 1;
  else if (xeno >= 9) militancy -= 2;

  if (expansionism <= 5) militancy -= 1;
  else if (expansionism >= 9 && expansionism <= 11) militancy += 1;
  else if (expansionism >= 12) militancy += 2;

  planet.population.militancy = Math.max(militancy, 1);
};

const assignExpansionism = (planet) => {
  const gov = planet.government.code;
  const div = planet.population.diversity;
  const xeno = planet.population.xenophilia;

  let expansionism = twoD6();
  if (gov === 10 || gov >= 12) expansionism += 2;

  if (div <= 3) expansionism += 3;
  else if (div >= 12) expansionism -= 3;

  if (xeno <= 5) expansionism += 1;
  else if (xeno >= 9) expansionism -= 2;

  planet.population.expansionism = Math.max(expansionism, 1);
};

const assignProgressiveness = (planet) => {
  const gov = planet.government.code;
  const law = planet.lawLevelCode;
  const pop = planet.population.code;
  const div = planet.population.diversity;
  const xeno = planet.population.xenophilia;
  const coh = planet.population.cohesion;

  let progressiveness = twoD6();

  if (pop >= 6 && pop <= 8) progressiveness -= 1;
  else if (pop >= 9) progressiveness -= 2;

  if (gov === 5) progressiveness += 1;
  else if (gov === 11) progressiveness -= 2;
  else if (gov === 13 || gov === 14) progressiveness -= 6;

  if (law >= 9 && law <= 11) progressiveness -= 1;
  else if (law >= 12) progressiveness -= 4;

  if (div <= 3) progressiveness -= 2;
  else if (div >= 12) progressiveness += 1;

  if (xeno <= 5) progressiveness -= 1;
  else if (xeno >= 9) progressiveness += 2;

  if (coh <= 5) progressiveness += 2;
  else if (coh > 9) progressiveness -= 2;

  planet.population.progressiveness = Math.max(progressiveness, 1);
};

const assignCulture = (planet) => {
  assignDiversity(planet);
  assignXenophilia(planet);
  assignUniqueness(planet);
  assignSymbology(planet);
  assignCohesion(planet);
  assignProgressiveness(planet);
  assignExpansionism(planet);
  assignMilitancy(planet);
};

module.exports = { assignCulture };

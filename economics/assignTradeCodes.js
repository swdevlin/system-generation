// page 186
const isAgricultural = (planet) => {
  if (planet.atmosphere.code >= 4 && planet.atmosphere.code <= 9)
    if (planet.hydrographics.code >= 4 && planet.hydrographics.code <= 8)
      if (planet.population.code >= 5 && planet.population.code <= 7) return true;

  return false;
};

const isAsteroid = (planet) => {
  if (planet.atmosphere.code === 0)
    if (planet.hydrographics.code === 0) if (planet.size === 0) return true;

  return false;
};

const isBarren = (planet) => {
  if (planet.population.code === 0)
    if (planet.governmentCode === 0) if (planet.lawLevelCode === 0) return true;

  return false;
};

const isDesert = (planet) => {
  if (planet.atmosphere.code >= 2 && planet.atmosphere.code <= 9)
    if (planet.hydrographics.code === 0) return true;

  return false;
};

const isFluidOceans = (planet) => {
  if (
    (planet.atmosphere.code >= 10 && planet.atmosphere.code <= 120) ||
    planet.atmosphere.code >= 15
  )
    if (planet.hydrographics.code >= 1) return true;

  return false;
};

const isGarden = (planet) => {
  if (planet.size >= 6 && planet.size <= 8)
    if (
      planet.atmosphere.code === 5 ||
      planet.atmosphere.code === 6 ||
      planet.atmosphere.code === 8
    )
      if (planet.hydrographics.code >= 5 && planet.hydrographics.code <= 7) return true;

  return false;
};

const isHighPopulation = (planet) => {
  return planet.population.code >= 9;
};

const isHighTech = (planet) => {
  return planet.techLevel >= 12;
};

const isIceCapped = (planet) => {
  if (planet.atmosphere.code === 0 || planet.atmosphere.code === 1)
    if (planet.hydrographics.code >= 1) return true;

  return false;
};

const isIndustrial = (planet) => {
  if ([0, 1, 2, 4, 7, 9, 10, 11, 12].includes(planet.atmosphere.code))
    if (planet.population.code >= 9) return true;

  return false;
};

const isLowPopulation = (planet) => {
  return planet.population.code >= 1 && planet.population.code <= 3;
};

const isLowTech = (planet) => {
  if (planet.population.code >= 1) if (planet.techLevel <= 5) return true;

  return false;
};

const isNonAgricultural = (planet) => {
  if (planet.atmosphere.code <= 3)
    if (planet.hydrographics.code <= 3) if (planet.population.code >= 6) return true;

  return false;
};

const isNonIndustrial = (planet) => {
  return planet.population.code >= 4 && planet.population.code <= 6;
};

const isPoor = (planet) => {
  if (planet.atmosphere.code >= 2 && planet.atmosphere.code <= 5)
    if (planet.hydrographics.code <= 3) return true;

  return false;
};

const isRich = (planet) => {
  if (planet.atmosphere.code === 6 || planet.atmosphere.code === 8)
    if (planet.population.code >= 6 && planet.population.code <= 8)
      if (planet.governmentCode >= 4 && planet.governmentCode <= 9) return true;

  return false;
};

const isVacuumWorld = (planet) => {
  return planet.atmosphere.code === 0;
};

const isWaterworld = (planet) => {
  if ([2, 3, 4, 5, 6, 7, 8, 9, 13, 14].includes(planet.atmosphere.code))
    if (planet.hydrographics.code === 10) return true;

  return false;
};

const assignTradeCodes = (planet) => {
  if (!planet) return;
  if (!planet.tradeCodes) planet.tradeCodes = [];
  else planet.tradeCodes.length = 0;
  if (isAgricultural(planet)) planet.tradeCodes.push('Ag');
  if (isAsteroid(planet)) planet.tradeCodes.push('As');
  if (isBarren(planet)) planet.tradeCodes.push('Ba');
  if (isDesert(planet)) planet.tradeCodes.push('De');
  if (isFluidOceans(planet)) planet.tradeCodes.push('Fl');
  if (isGarden(planet)) planet.tradeCodes.push('Ga');
  if (isHighPopulation(planet)) planet.tradeCodes.push('Hi');
  if (isHighTech(planet)) planet.tradeCodes.push('Ht');
  if (isIceCapped(planet)) planet.tradeCodes.push('Ic');
  if (isIndustrial(planet)) planet.tradeCodes.push('In');
  if (isLowPopulation(planet)) planet.tradeCodes.push('Lo');
  if (isLowTech(planet)) planet.tradeCodes.push('Lt');
  if (isNonAgricultural(planet)) planet.tradeCodes.push('Na');
  if (isNonIndustrial(planet)) planet.tradeCodes.push('Ni');
  if (isPoor(planet)) planet.tradeCodes.push('Po');
  if (isRich(planet)) planet.tradeCodes.push('Ri');
  if (isVacuumWorld(planet)) planet.tradeCodes.push('Va');
  if (isWaterworld(planet)) planet.tradeCodes.push('Wa');
};

module.exports = {
  assignTradeCodes: assignTradeCodes,
  isWaterworld: isWaterworld,
  isVacuumWorld: isVacuumWorld,
  isRich: isRich,
  isPoor: isPoor,
  isNonIndustrial: isNonIndustrial,
  isNonAgricultural: isNonAgricultural,
  isLowTech: isLowTech,
  isLowPopulation: isLowPopulation,
  isIndustrial: isIndustrial,
  isIceCapped: isIceCapped,
  isHighTech: isHighTech,
  isHighPopulation: isHighPopulation,
  isGarden: isGarden,
  isFluidOceans: isFluidOceans,
  isDesert: isDesert,
  isBarren: isBarren,
  isAsteroid: isAsteroid,
  isAgricultural: isAgricultural,
};

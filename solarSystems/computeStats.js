const { orbitToAU } = require('../utils');

const computeStats = (sector) => {
  const stats = {
    solarSystems: sector.solarSystems.length,
    totalTerrestrial: 0,
    totalGasGiants: 0,
    totalPlanetoidBelts: 0,
    totalStars: 0,
    totalCompanions: 0,
    maxTerrestrial: 0,
    maxGasGiants: 0,
    maxPlanetoidBelts: 0,
    maxStars: 0,
    stellarClass: {},
    stellarType: {},
    anomalies: {},
    smallestSolarSystem: 9999999,
    largestSolarSystem: 0,
    maxSignificantMoons: 0,
  };

  sector.solarSystems.reduce((stats, solarSystem) => {
    stats.totalTerrestrial += solarSystem.terrestrialPlanets;
    stats.totalGasGiants += solarSystem.gasGiants;
    stats.totalPlanetoidBelts += solarSystem.planetoidBelts;
    stats.totalStars += solarSystem.stars.length;
    if (solarSystem.terrestrialPlanets > stats.maxTerrestrial)
      stats.maxTerrestrial = solarSystem.terrestrialPlanets;
    if (solarSystem.gasGiants > stats.maxGasGiants) stats.maxGasGiants = solarSystem.gasGiants;
    if (solarSystem.planetoidBelts > stats.maxPlanetoidBelts)
      stats.maxPlanetoidBelts = solarSystem.planetoidBelts;
    if (solarSystem.stars.length > stats.maxStars) stats.maxStars = solarSystem.stars.length;

    solarSystem.stars.reduce((stats, star) => {
      if (star.companion) stats.totalCompanions++;
      const stellarClass = star.stellarClass;
      stats.stellarClass[stellarClass] = (stats.stellarClass[stellarClass] || 0) + 1;

      const stellarType = star.stellarType;
      stats.stellarType[stellarType] = (stats.stellarType[stellarType] || 0) + 1;

      if (star.isAnomaly) stats.anomalies[stellarType] = (stats.anomalies[stellarType] || 0) + 1;

      const systemSize =
        orbitToAU(star.orbit) + orbitToAU(star.occupiedOrbits[star.occupiedOrbits.length - 1]);
      if (systemSize < stats.smallestSolarSystem) stats.smallestSolarSystem = systemSize;
      if (systemSize > stats.largestSolarSystem) stats.largestSolarSystem = systemSize;

      stats.maxSignificantMoons = star.stellarObjects.reduce((moons, obj) => {
        if (!obj.moons) return moons;
        const l = obj.moons.length;
        return l > moons ? l : moons;
      }, stats.maxSignificantMoons);

      return stats;
    }, stats);

    return stats;
  }, stats);

  return stats;
};

module.exports = computeStats;

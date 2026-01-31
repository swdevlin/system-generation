const SolarSystem = require("./solarSystem");
const starFromDefinition = require("../stars/starFromDefinition");
const {ORBIT_TYPES, additionalStarDM, calculatePeriod} = require("../utils");
const predefinedClassification = require("../stars/predefinedClassification");
const generateCloseSecondary = require("../stars/generateCloseSecondary");
const addCompanion = require("../stars/addCompanion");
const generateNearSecondary = require("../stars/generateNearSecondary");
const generateFarSecondary = require("../stars/generateFarSecondary");
const {determineStarClassification} = require("../stars/determineStarClassification");
const {twoD6, d6} = require("../dice");
const Star = require("../stars/star");
const companionDM = require("../stars/companionDM");
const loadStarsFromDefinition = require("./loadStarsFromDefinition");
const assignStars = require("./assignStars");
const loadPlanetsFromDefinition = require("./loadPlanetsFromDefinition");
const {gasGiantQuantity} = require("../gasGiants");
const {planetoidBeltQuantity} = require("../planetoidBelts");
const terrestrialPlanetQuantity = require("../terrestrialPlanet/terrestrialPlanetQuantity");
const {assignTradeCodes} = require("../economics/assignTradeCodes");
const Populated = require("./populated");

class SolarSystemGenerator {
  constructor(definition, populated, unusualChance) {
    this.definition = definition;
    this.starSystem = null;
    this.unusualChance = unusualChance || 0;
    this.unusualChance /= 100.0;
    this.bodies = [];
    this.surveyIndex = definition?.surveyIndex ?? 0;
    this.populated = populated ? new Populated(populated) : null;
  }

  generate() {
    const systemName = this.definition?.name ?? null;
    const solarSystem = new SolarSystem(systemName);
    if (this.definition) {
      if (this.definition.allegiance)
        solarSystem.allegiance = this.definition.allegiance;
      solarSystem.known = this.definition.known ? this.definition.known : false;
      if (this.definition.bases) {
        solarSystem.bases = this.definition.bases;
      }
      loadStarsFromDefinition({
        unusualChance: this.unusualChance,
        definition: this.definition,
        solarSystem: solarSystem,
      })
    } else {
      assignStars({solarSystem: solarSystem, unusualChance: unusualChance});
    }

    if (solarSystem.onlyBrownDwarfs())
      solarSystem.surveyIndex = 0;
    else
      solarSystem.surveyIndex = this.surveyIndex;

    solarSystem.determineAvailableOrbits();

    if (this.definition) {
      loadPlanetsFromDefinition({
        definition: this.definition,
        solarSystem: solarSystem
      });
    } else {
      solarSystem.gasGiants = gasGiantQuantity(solarSystem);
      solarSystem.planetoidBelts = planetoidBeltQuantity(solarSystem);
      solarSystem.terrestrialPlanets = terrestrialPlanetQuantity(solarSystem);

      solarSystem.distributeObjects();
      solarSystem.assignOrbits();
      solarSystem.addAnomalousPlanets();
    }
    solarSystem.addMoons();
    solarSystem.setRotationPeriod();
    solarSystem.assignAtmospheres();
    solarSystem.assignBiomass();
    solarSystem.assignResourceRatings();
    solarSystem.assignHabitabilityRatings();
    solarSystem.assignOrbitSequences();
    const p = this.populated?.getAllegiance(row, col);
    if (p && p.allegiance) {
        solarSystem.assignMainWorldSocialCharacteristics(p);
        solarSystem.allegiance = p.allegiance;
        assignTradeCodes(solarSystem.mainWorld);
    }
    solarSystem.mainWorldOrbitSequence = solarSystem.mainWorld.orbitSequence;
  }

};

module.exports = SolarSystemGenerator;

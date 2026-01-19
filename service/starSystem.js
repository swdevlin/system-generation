const express = require('express');
const router = express.Router();
// const { Random } = require('random-js');
const SolarSystem = require("../solarSystems/solarSystem");
const loadStarsFromDefinition = require("../solarSystems/loadStarsFromDefinition");
const loadPlanetsFromDefinition = require("../solarSystems/loadPlanetsFromDefinition");
// const r = new Random();
const toJSON = require("../utils/toJSON");

router.post('/', (req, res) => {
    const definition = req.body;
    const starSystem =  new SolarSystem(definition.name);
    const sector = { unusualChance: definition.unusualChance || 0 };
    const subsector = { };
    loadStarsFromDefinition({
        sector: sector,
        subsector: subsector,
        definition: definition,
        solarSystem: starSystem,
    });

    starSystem.determineAvailableOrbits();

    loadPlanetsFromDefinition({
        sector: sector,
        subsector: subsector,
        definition: definition,
        solarSystem: starSystem
    });

    starSystem.addMoons();
    starSystem.assignAtmospheres();
    starSystem.assignBiomass();
    starSystem.assignResourceRatings();
    starSystem.assignHabitabilityRatings();
    starSystem.assignOrbitSequences();
    starSystem.mainWorldOrbitSequence = starSystem.mainWorld.orbitSequence;

    const tenant = req.tenantId;
    req.logger.info(`Generated StarSystem`, { tenant });
    res.json(toJSON(starSystem));
});

module.exports = router;

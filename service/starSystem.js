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


/*

const express = require('express');
const router = express.Router();
const SolarSystem = require("../solarSystems/solarSystem");
const loadStarsFromDefinition = require("../solarSystems/loadStarsFromDefinition");
const loadPlanetsFromDefinition = require("../solarSystems/loadPlanetsFromDefinition");
const assignMoons = require("../moons/assignMoons");
const toJSON = require("../utils/toJSON");

router.post('/', (req, res) => {
    const definition = req.body;
    const tenant = req.tenantId;
    const sector = { name: definition.sector || 'Unknown', unusualChance: definition.unusualChance || 0 };

    try {
        const solarSystem = new SolarSystem(definition.name || '');
        solarSystem.sector = sector.name;
        solarSystem.coordinates = definition.coordinates || '0101';

        // Load stars based on definition or random assignment
        loadStarsFromDefinition({
            sector: sector,
            subsector: {},
            definition: definition,
            solarSystem: solarSystem,
        });

        solarSystem.determineAvailableOrbits();

        // Load planets based on definition
        loadPlanetsFromDefinition({
            sector: sector,
            subsector: {},
            definition: definition,
            solarSystem: solarSystem
        });

        solarSystem.addMoons();
        solarSystem.assignAtmospheres();
        solarSystem.assignBiomass();
        solarSystem.assignResourceRatings();
        solarSystem.assignHabitabilityRatings();

        req.logger.info(`Generated Star System ${solarSystem.name}`, { tenant, coordinates: solarSystem.coordinates });

        // Return JSON representation
        res.json({
            name: solarSystem.name,
            coordinates: solarSystem.coordinates,
            stars: solarSystem.starsSummary(),
            primaryStar: toJSON(solarSystem.primaryStar),
            gasGiants: solarSystem.gasGiants,
            planetoidBelts: solarSystem.planetoidBelts,
            terrestrialPlanets: solarSystem.terrestrialPlanets,
            remarks: solarSystem.remarks,
            mainWorld: solarSystem.mainWorld
        });
    } catch (error) {
        req.logger.error(`Failed to generate star system: ${error.message}`, { tenant, stack: error.stack });
        res.status(500).json({ error: "Internal Server Error during generation" });
    }
});

module.exports = router;


 */

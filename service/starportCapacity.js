'use strict';

const express = require('express');
const router = express.Router();

const StarportCapacityGenerator = require('../starportCapacity/StarportCapacityGenerator');

const VALID_STARPORTS = ['A', 'B', 'C', 'D', 'E', 'X'];

// isIndustrial() keys off an atmosphere code (plus population.code >= 9); these
// two stand-in codes make it evaluate to exactly the caller's `industrial`
// flag, so callers can send a single boolean instead of a real atmosphere digit.
const INDUSTRIAL_ATMOSPHERE_CODE = 0;
const NON_INDUSTRIAL_ATMOSPHERE_CODE = 5;

function validateRequest(req, res, next) {
  const {
    starPort,
    populationCode,
    censusPopulation,
    importance,
    efficiency,
    infrastructure,
    techLevel,
    industrial,
  } = req.body;

  if (!VALID_STARPORTS.includes(starPort))
    return res.status(400).json({ error: 'starPort must be one of: A, B, C, D, E, X' });

  if (!Number.isInteger(populationCode) || populationCode < 0 || populationCode > 15)
    return res.status(400).json({ error: 'populationCode must be an integer from 0 to 15' });

  if (!Number.isInteger(censusPopulation) || censusPopulation < 0)
    return res.status(400).json({ error: 'censusPopulation must be a non-negative integer' });

  if (!Number.isInteger(importance))
    return res.status(400).json({ error: 'importance must be an integer' });

  if (typeof efficiency !== 'number' || efficiency < -5 || efficiency > 5)
    return res.status(400).json({ error: 'efficiency must be a number from -5 to 5' });

  if (!Number.isInteger(infrastructure) || infrastructure < 0)
    return res.status(400).json({ error: 'infrastructure must be a non-negative integer' });

  if (!Number.isInteger(techLevel) || techLevel < 0)
    return res.status(400).json({ error: 'techLevel must be a non-negative integer' });

  if (typeof industrial !== 'boolean')
    return res.status(400).json({ error: 'industrial must be a boolean' });

  next();
}

router.post('/', validateRequest, (req, res) => {
  const {
    starPort,
    populationCode,
    censusPopulation,
    importance,
    efficiency,
    infrastructure,
    techLevel,
    industrial,
  } = req.body;

  const planet = {
    starPort,
    population: { code: populationCode, censusPopulation },
    economics: { importance, efficiency, infrastructure },
    techLevel: { code: techLevel },
    atmosphere: {
      code: industrial ? INDUSTRIAL_ATMOSPHERE_CODE : NON_INDUSTRIAL_ATMOSPHERE_CODE,
    },
  };

  StarportCapacityGenerator.assign(planet);

  req.logger.info('Computed starport capacity', { tenant: req.tenantId, starPort });
  res.json(planet.starportCapacity ?? {});
});

module.exports = router;

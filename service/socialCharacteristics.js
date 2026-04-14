'use strict';

const express = require('express');
const router = express.Router();
const { MainWorldSelector, VALID_CRITERIA } = require('../solarSystems/MainWorldSelector');
const SocialCharacteristicsAssigner = require('../solarSystems/SocialCharacteristicsAssigner');

function validateRequest(req, res, next) {
  const {
    system,
    population,
    government,
    lawLevel,
    techLevel,
    mainWorldCriteria,
    allowCaptiveGovernment,
  } = req.body;

  if (!system || typeof system !== 'object' || Array.isArray(system))
    return res.status(400).json({ error: 'system is required and must be an object' });
  if (!Array.isArray(system.primaryStar?.stellarObjects))
    return res.status(400).json({ error: 'system.primaryStar.stellarObjects must be an array' });

  if (!population || typeof population !== 'object' || Array.isArray(population))
    return res.status(400).json({ error: 'population is required and must be an object' });
  {
    const { min, max } = population;
    if (min !== undefined) {
      if (!Number.isInteger(min) || min < 0)
        return res.status(400).json({ error: 'population min must be a non-negative integer' });
      if (min > 10)
        return res.status(400).json({ error: 'population min cannot exceed 10' });
    }
    if (max !== undefined) {
      if (!Number.isInteger(max) || max < 0)
        return res.status(400).json({ error: 'population max must be a non-negative integer' });
    }
    if (min !== undefined && max !== undefined && min > max)
      return res.status(400).json({ error: 'population.min must not exceed population.max' });
  }

  if (government !== undefined) {
    if (!Number.isInteger(government) || government < 0)
      return res.status(400).json({ error: 'government must be at least 0' });
  }

  if (lawLevel !== undefined) {
    if (!Number.isInteger(lawLevel) || lawLevel < 0)
      return res.status(400).json({ error: 'lawLevel must be at least 0' });
  }

  if (techLevel !== undefined) {
    if (typeof techLevel !== 'object' || techLevel === null || Array.isArray(techLevel))
      return res.status(400).json({ error: 'techLevel must be an object' });
    const { min, max } = techLevel;
    if (min !== undefined) {
      if (!Number.isInteger(min) || min < 0)
        return res.status(400).json({ error: 'techLevel min must be a non-negative integer' });
    }
    if (max !== undefined) {
      if (!Number.isInteger(max) || max < 0)
        return res.status(400).json({ error: 'techLevel max must be a non-negative integer' });
    }
    if (min !== undefined && max !== undefined && min > max)
      return res.status(400).json({ error: 'techLevel.min must not exceed techLevel.max' });
  }

  if (mainWorldCriteria !== undefined && !VALID_CRITERIA.includes(mainWorldCriteria))
    return res.status(400).json({ error: 'mainWorldCriteria must be one of: habitable, habitableAndResource, resource' });

  if (allowCaptiveGovernment !== undefined && typeof allowCaptiveGovernment !== 'boolean')
    return res.status(400).json({ error: 'allowCaptiveGovernment must be a boolean' });

  next();
}

router.post('/', validateRequest, (req, res) => {
  const {
    system,
    population,
    government,
    lawLevel,
    techLevel,
    mainWorldCriteria = 'habitable',
    allowCaptiveGovernment = true,
  } = req.body;

  const selector = new MainWorldSelector(system, mainWorldCriteria);
  const result = selector.select();
  if (!result) return res.status(422).json({ error: 'No valid main world found for criteria' });

  const spec = { population, government, lawLevel, techLevel, allowCaptiveGovernment };
  const assigner = new SocialCharacteristicsAssigner(result.world, result.star, spec, system);
  assigner.assign();

  req.logger.info('Assigned social characteristics', { tenant: req.tenantId });
  res.json({ world: result.world, path: result.path });
});

module.exports = router;

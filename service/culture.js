'use strict';

const express = require('express');
const router = express.Router();
const { assignCulture } = require('../population/assignCulture');
const {assignGovernmentDetails} = require("../government/assignGovernmentDetails");

function validateRequest(req, res, next) {
  const { planet } = req.body;

  if (!planet || typeof planet !== 'object' || Array.isArray(planet))
    return res.status(400).json({ error: 'planet is required and must be an object' });

  if (!planet.population || typeof planet.population !== 'object')
    return res.status(400).json({ error: 'planet.population is required and must be an object' });

  if (!Number.isInteger(planet.population.code) || planet.population.code < 0)
    return res.status(400).json({ error: 'planet.population.code must be a non-negative integer' });

  if (!planet.population.concentrationRating && planet.population.concentrationRating !== 0)
    return res.status(400).json({ error: 'planet.population.concentrationRating is required' });

  if (!planet.government || typeof planet.government !== 'object')
    return res.status(400).json({ error: 'planet.government is required and must be an object' });

  if (!Number.isInteger(planet.government.code) || planet.government.code < 0)
    return res.status(400).json({ error: 'planet.government.code must be a non-negative integer' });

  if (!Number.isInteger(planet.lawLevel?.code) || planet.lawLevel.code < 0)
    return res.status(400).json({ error: 'planet.lawLevel.code must be a non-negative integer' });

  if (!Number.isInteger(planet.techLevel) || planet.techLevel < 0)
    return res.status(400).json({ error: 'planet.techLevel must be a non-negative integer' });

  if (typeof planet.starport !== 'string')
    return res.status(400).json({ error: 'planet.starport must be a string' });

  next();
}

router.post('/', validateRequest, (req, res) => {
  const { planet } = req.body;

  assignCulture(planet);
  assignGovernmentDetails(planet);
  req.logger.info('Assigned culture', { tenant: req.tenantId });
  res.json({ planet });
});

module.exports = router;

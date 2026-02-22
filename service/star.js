const express = require('express');
const router = express.Router();
const Star = require('../stars/star');
const StellarClassification = require('../stars/StellarClassification');
const { ORBIT_TYPES } = require('../utils/constants');

const NORMAL_TYPES = new Set(['O', 'B', 'A', 'F', 'G', 'K', 'M']);
const BROWN_DWARF_TYPES = new Set(['L', 'T', 'Y']);
const ANOMALY_TYPES = new Set(['D', 'NS', 'BH', 'BD', 'PSR', 'SC', 'AN', 'NB', 'PS']);
const VALID_TYPES = new Set([...NORMAL_TYPES, ...BROWN_DWARF_TYPES, ...ANOMALY_TYPES]);
const VALID_CLASSES = new Set(['Ia', 'Ib', 'II', 'III', 'IV', 'V', 'VI']);

router.get('/', (req, res) => {
  const { stellarType, subtype, stellarClass } = req.query;
  const tenant = req.tenantId;

  if (!stellarType || !VALID_TYPES.has(stellarType)) {
    return res.status(400).json({ error: `Invalid or missing stellarType. Valid values: ${[...VALID_TYPES].join(', ')}` });
  }

  const needsSubtype = NORMAL_TYPES.has(stellarType) || BROWN_DWARF_TYPES.has(stellarType);
  const parsedSubtype = subtype !== undefined ? parseInt(subtype, 10) : null;

  if (needsSubtype) {
    if (parsedSubtype === null || isNaN(parsedSubtype) || parsedSubtype < 0 || parsedSubtype > 9) {
      return res.status(400).json({ error: 'subtype must be an integer 0–9 for this stellar type' });
    }
    if (!stellarClass || !VALID_CLASSES.has(stellarClass)) {
      return res.status(400).json({ error: `Invalid or missing stellarClass. Valid values: ${[...VALID_CLASSES].join(', ')}` });
    }

    if (stellarType === 'O' && stellarClass === 'IV') {
      return res.status(400).json({ error: 'O type stars cannot be class IV' });
    }
    if ((stellarType === 'A' || stellarType === 'F') && stellarClass === 'VI') {
      return res.status(400).json({ error: 'A and F type stars cannot be class VI' });
    }
    if (stellarType === 'M' && stellarClass === 'IV') {
      return res.status(400).json({ error: 'M type stars cannot be class IV' });
    }
    if (stellarType === 'K' && parsedSubtype >= 5 && stellarClass === 'IV') {
      return res.status(400).json({ error: 'K5+ stars cannot be class IV' });
    }
  }

  const classification = new StellarClassification();
  classification.stellarType = stellarType;
  classification.stellarClass = stellarClass || '';
  classification.subtype = parsedSubtype !== null ? parsedSubtype : '';
  classification.isProtostar = stellarType === 'PS';

  let star;
  try {
    star = new Star(classification, ORBIT_TYPES.PRIMARY);
  } catch (e) {
    req.logger.error(`Failed to generate star: ${e.message}`, { tenant });
    return res.status(400).json({ error: e.message });
  }

  req.logger.info(`Generated star ${stellarType}${parsedSubtype ?? ''} ${stellarClass ?? ''}`.trim(), { tenant });

  res.json({
    stellarType: star.stellarType,
    subtype: star.subtype,
    stellarClass: star.stellarClass,
    mass: star.mass,
    diameter: star.diameter,
    temperature: star.temperature,
    luminosity: star.luminosity,
    hzco: star.hzco,
    minimumAllowableOrbit: star.minimumAllowableOrbit,
    jumpShadow: star.jumpShadow,
    colour: star.colour,
    age: star.age,
  });
});

module.exports = router;

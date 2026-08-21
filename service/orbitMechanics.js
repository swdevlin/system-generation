const express = require('express');
const router = express.Router();
const { recalculateSystemOrbitPositions } = require('../utils/orbitPosition');

router.post('/', (req, res) => {
  const { primaryStar } = req.body;

  if (!primaryStar) {
    return res.status(400).json({ error: 'primaryStar is required' });
  }

  try {
    recalculateSystemOrbitPositions(primaryStar);
    req.logger.info(`Recalculated orbit mechanics`, { tenant: req.tenantId });
    res.json({ primaryStar });
  } catch (e) {
    req.logger.error(e.message, { tenant: req.tenantId });
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
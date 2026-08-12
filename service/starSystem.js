const express = require('express');
const router = express.Router();
const toJSON = require("../utils/toJSON");
const generateStarSystem = require("../solarSystems/generateStarSystem");
const { hasEmptyGovernmentTypes } = require('./validateGovernmentTypes');

router.post('/', (req, res) => {
    const { subsector, ...definition } = req.body;

    if (hasEmptyGovernmentTypes(definition) || hasEmptyGovernmentTypes(subsector)) {
        return res.status(400).json({ error: 'governmentTypes must not be an empty array' });
    }

    const starSystem = generateStarSystem(definition, subsector);

    const tenant = req.tenantId;
    req.logger.info(`Generated StarSystem`, { tenant });
    res.json(toJSON(starSystem));
});

module.exports = router;

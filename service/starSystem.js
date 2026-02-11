const express = require('express');
const router = express.Router();
const toJSON = require("../utils/toJSON");
const generateStarSystem = require("./generateStarSystem");

router.post('/', (req, res) => {
    const definition = req.body;
    const starSystem = generateStarSystem(definition);

    const tenant = req.tenantId;
    req.logger.info(`Generated StarSystem`, { tenant });
    res.json(toJSON(starSystem));
});

module.exports = router;

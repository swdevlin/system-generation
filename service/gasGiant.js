const express = require('express');
const router = express.Router();
const { GasGiant } = require('../gasGiants');
const { SOL_DIAMETER } = require('../utils');
const { d6, threeD6, twoD6 } = require('../dice');
const { Random } = require('random-js');
const r = new Random();

router.get('/', (req, res) => {
    const size = req.query.size ? req.query.size.toUpperCase() : 'GM';
    const tenant = req.tenantId;

    let gg;
    if (size === 'GS') {
        gg = new GasGiant(size, SOL_DIAMETER * (r.die(3) + r.die(3)), r.integer(2, 7) * 5);
    } else if (size === 'GM') {
        gg = new GasGiant(size, SOL_DIAMETER * (d6() + 6), 20 * (threeD6() - 1));
    } else if (size === 'GL') {
        gg = new GasGiant(size, SOL_DIAMETER * (twoD6() + 6), r.die(3) * 50 * (threeD6() + 4));
    } else {
        req.logger.error(`Invalid size requested: ${size}`, { tenant });
        return res.status(400).json({ error: "Invalid size. Use GS, GM, or GL." });
    }

    if (gg.mass >= 3000) {
        gg.mass = 4000 - 200 * (twoD6() - 2);
    }

    req.logger.info(`Generated GasGiant ${size}`, { tenant });
    res.json(gg);
});

module.exports = router;
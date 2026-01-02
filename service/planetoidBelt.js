const express = require('express');
const router = express.Router();
const { 
  PlanetoidBelt, 
  determineBeltComposition, 
  determineBeltBulk, 
  determineBeltResourceRating, 
} = require('../planetoidBelts');
const { twoD6 } = require('../dice');

router.get('/', (req, res) => {
  let star = {age: 0};
  const belt = new PlanetoidBelt();

  belt.span = (twoD6() / 10);
  determineBeltComposition(star, belt);
  determineBeltBulk(star, belt);
  determineBeltResourceRating(star, belt);

    res.json(belt);
});

module.exports = router;
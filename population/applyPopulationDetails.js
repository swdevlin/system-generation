'use strict';

const { assignConcentrationRating } = require('./assignConcentrationRating');
const { assignUrbanizationPercentage } = require('./assignUrbanizationPercentage');
const { assignMajorCities } = require('./assignMajorCities');
const { assignCulture } = require('./assignCulture');

const applyPopulationDetails = (star, planet) => {
  assignConcentrationRating(star, planet);
  assignUrbanizationPercentage(planet);
  assignMajorCities(planet);
  assignCulture(planet);
};

module.exports = { applyPopulationDetails };
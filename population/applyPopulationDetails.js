'use strict';

const { assignConcentrationRating } = require('./assignConcentrationRating');
const { assignUrbanizationPercentage } = require('./assignUrbanizationPercentage');
const { assignMajorCities } = require('./assignMajorCities');
const { assignCulture } = require('./assignCulture');
const { assignGovernmentDetails } = require('../government/assignGovernmentDetails');
const { assignEconomics } = require('./assignEconomics');

const applyPopulationDetails = (star, planet, starSystem) => {
  assignConcentrationRating(star, planet);
  assignUrbanizationPercentage(planet);
  assignMajorCities(planet);
  assignCulture(planet);
  assignGovernmentDetails(planet);
  assignEconomics(starSystem, planet);
  assignLawDetails(planet);
};

module.exports = { applyPopulationDetails };

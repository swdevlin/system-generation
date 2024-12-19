const {percentageChance} = require("../dice");

class Populated {
  constructor(spec) {
    if (!spec) {
      this.type = null;
      return;
    }

    this.type = spec.type;

    this.allegiance = new Array(11).fill(undefined);

    if (this.type === 'full') {
      this.demarcation = 11;
      this.before = {
        minTechLevel: spec.minTechLevel,
        maxTechLevel: spec.maxTechLevel,
        minPopulationCode: spec.minPopulationCode || 0,
        maxPopulationCode: spec.maxPopulationCode || 15,
        allegiance: spec.allegiance,
      }
      this.after = null;
    } else {
      this.demarcation = spec.demarcation;
      this.before = spec.before;
      this.after = spec.after;
    }
    if (this.before) {
      this.before['minTechLevel'] ||= 0;
      this.before['maxTechLevel'] ||= 16;
      this.before['minPopulationCode'] ||= 0;
      this.before['maxPopulationCode'] ||= 16;
      this.before['allegiance'] ||= null;
    }
    if (this.after) {
      this.after['minTechLevel'] ||= 0;
      this.after['maxTechLevel'] ||= 16;
      this.after['minPopulationCode'] ||= 0;
      this.after['maxPopulationCode'] ||= 16;
      this.after['allegiance'] ||= null;
    }

  }

  getAllegiance(row, col) {
    if (!this.type)
      return null;

    if (this.type === 'full') {
      return this.before;
    } else if (this.type === 'hard-horizontal') {
      if (row <= this.demarcation)
        return this.before;
      else
        return this.after;
    } else if (this.type === 'hard-vertical') {
      if (col <= this.demarcation)
        return this.before;
      else
        return this.after;
    } else if (this.type === 'split-horizontal') {
      if (this.allegiance[col] !== undefined)
        return this.allegiance[col];

      let percentage = 0.5 + (this.demarcation-row) * 0.25;
      if (percentageChance(percentage))
        return this.before;
      else {
        this.allegiance[col] = this.after;
        return this.after;
      }
    } else if (this.type === 'split-vertical') {
      if (this.allegiance[row] !== undefined)
        return this.allegiance[row];

      let percentage = 0.5 + (this.demarcation-col) * 0.25;
      if (percentageChance(percentage))
        return this.before;
      else {
        this.allegiance[row] = this.after;
        return this.after;
      }
    } else
      return null;
  }
}

module.exports = Populated;

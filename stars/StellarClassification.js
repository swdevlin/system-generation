const {isAnomaly} = require("../utils");

class StellarClassification {
  constructor() {
    this.stellarClass = '';
    this.stellarType = '';
    this.subtype = null;
    this.isProtostar = false;
  }

  get isAnomaly() {
    return this.isProtostar || isAnomaly(this.stellarType);
  }

}

module.exports = StellarClassification;

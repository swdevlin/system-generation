const {twoD6} = require("../dice");
const {STELLAR_TYPES} = require("../utils");

const peculiarStarLookup = () => {
  const roll = twoD6();

  if (roll <= 2)
    return STELLAR_TYPES.BlackHole;
  else
    switch (roll) {
      case 3:
        return STELLAR_TYPES.Pulsar;
      case 4:
        return STELLAR_TYPES.NeutronStar;
      case 5:
      case 6:
        return STELLAR_TYPES.Nebula;
      case 7:
      case 8:
      case 9:
        return STELLAR_TYPES.Protostar;
      case 10:
        return STELLAR_TYPES.StarCluster;
      default:
        return STELLAR_TYPES.Anomaly;
  }
}

module.exports = peculiarStarLookup;

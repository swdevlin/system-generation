const ORBIT_TYPES = {
  PRIMARY: 0,
  CLOSE: 1,
  NEAR: 2,
  FAR: 3,
  COMPANION: 4,
  GAS_GIANT: 10,
  TERRESTRIAL: 11,
  PLANETOID_BELT: 12,
  PLANETOID_BELT_OBJECT: 13,
};

const STELLAR_TYPES = {
  WhiteDwarf: 'D',
  BrownDwarf: 'BD',
  BlackHole: 'BH',
  Pulsar: 'PSR',
  NeutronStar: 'NS',
  StarCluster: 'SC',
  Anomaly: 'AN',
  Nebula: 'NB',
  Protostar: 'PS',
};

module.exports = {
  ORBIT_TYPES,
  STELLAR_TYPES,
};

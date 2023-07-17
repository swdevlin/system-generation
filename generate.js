const Random = require("random-js").Random;

const STANDARD_CHANCE = 0.5;
const SPARSE_CHANCE = 0.33;
const DENSE_CHANCE = 0.66;
const RIFT_CHANCE = 0.16;
const EMPTY_CHANCE = 0.0;

const SUBSECTOR_TYPES = {
  STANDARD: 0,
  SPARSE: 1,
  DENSE: 2,
  EMPTY: 3,
  RIFT: 5,
  RIFT_TOPEDGE: 6,
  RIFT_BOTTOMEDGE: 7,
  RIFT_LEFTEDGE: 8,
  RIFT_RIGHTEDGE: 9,
}

const r = new Random();

const coordinate = (row, col) => {
  return '0' + col + ('0' + row).slice(-2);
}

const parseChance = (row, col, subsector_type) => {
  switch (subsector_type) {
    case SUBSECTOR_TYPES.STANDARD:
      return STANDARD_CHANCE;
    case SUBSECTOR_TYPES.SPARSE:
      return SPARSE_CHANCE;
    case SUBSECTOR_TYPES.DENSE:
      return DENSE_CHANCE;
    case SUBSECTOR_TYPES.EMPTY:
      return EMPTY_CHANCE;
    case SUBSECTOR_TYPES.RIFT:
      return RIFT_CHANCE;
    case SUBSECTOR_TYPES.RIFT_TOPEDGE:
      return (row > 4) ? RIFT_CHANCE : SPARSE_CHANCE;
    case SUBSECTOR_TYPES.RIFT_BOTTOMEDGE:
      return (row < 7) ? RIFT_CHANCE : SPARSE_CHANCE;
    case SUBSECTOR_TYPES.RIFT_LEFTEDGE:
      return (col > 2) ? RIFT_CHANCE : SPARSE_CHANCE;
    case SUBSECTOR_TYPES.RIFT_RIGHTEDGE:
      return (col < 7) ? RIFT_CHANCE : SPARSE_CHANCE;
  }
  return undefined;
}

const generateSubsector = (frequency) => {
  for (let col=1; col <= 8; col++)
    for (let row=1; row <= 10; row++) {
      const chance = parseChance(row, col, frequency);
      if (r.bool(chance)) {
        console.log(coordinate(row, col))
      }
    }
}

const SECTOR = [
  SUBSECTOR_TYPES.SPARSE_CHANCE, SUBSECTOR_TYPES.SPARSE_CHANCE, SUBSECTOR_TYPES.SPARSE_CHANCE, SUBSECTOR_TYPES.SPARSE_CHANCE,
  SUBSECTOR_TYPES.SPARSE_CHANCE, SUBSECTOR_TYPES.SPARSE_CHANCE, SUBSECTOR_TYPES.SPARSE_CHANCE, SUBSECTOR_TYPES.SPARSE_CHANCE,
  SUBSECTOR_TYPES.SPARSE_CHANCE, SUBSECTOR_TYPES.SPARSE_CHANCE, SUBSECTOR_TYPES.SPARSE_CHANCE, SUBSECTOR_TYPES.SPARSE_CHANCE,
  SUBSECTOR_TYPES.RIFT_TOPEDGE, SUBSECTOR_TYPES.RIFT_TOPEDGE, SUBSECTOR_TYPES.RIFT_TOPEDGE, SUBSECTOR_TYPES.RIFT_TOPEDGE,
];

;(async (sector) => {
  for (const subsector_type of sector) {
    console.log('subsector');
    generateSubsector(subsector_type);
  }
  console.log('done');
})(SECTOR)
.then(res => process.exit(0))
.catch(err => {
  console.log(err.stack);
  process.exit(0);
});

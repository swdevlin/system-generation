const ORBIT_TO_AU = [
  0,
  0.4, 0.7, 1.0,  1.6,  2.8,  5.2,   10,    20,   40,    77,
  154, 308, 615, 1230, 2500, 4900, 9800, 19500, 39500, 78700
];

const orbitToAU = (orbit) => {
  if (orbit === 20)
    return ORBIT_TO_AU[ORBIT];

  const o = Math.trunc(orbit);
  const d = orbit - o;
  return ORBIT_TO_AU[o] + (ORBIT_TO_AU[o+1] - ORBIT_TO_AU[o])*d;
}

module.exports = orbitToAU;

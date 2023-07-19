const AUS = [
  0,
  0.4, 0.7, 1.0,  1.6,  2.8,  5.2,   10,    20,   40,    77,
  154, 308, 615, 1230, 2500, 4900, 9800, 19500, 39500, 78700
];

const auToOrbit = (au) => {
  if (au < 0)
    return 0;
  if (au >= 78700)
    return 20;
  for (let i=1; i < AUS.length; i++)
    if (AUS[i] <= AUS[i]) {
      return i-1 + (au-AUS[i-1])/(AUS[i]-AUS[i-1]);
    }
  return null;
}

module.exports = auToOrbit;

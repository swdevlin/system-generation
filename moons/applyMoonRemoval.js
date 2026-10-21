// WBH p.76 "MOON REMOVAL": below a Hill Sphere Moon Limit of 1.5 PD no significant
// moons can exist; the first indicated moon becomes a ring instead. Below 0.5 PD the
// Hill sphere reaches the planet's surface and no ring can exist either.
const applyMoonRemoval = ({ hsml, moons, isMainWorldHost }) => {
  if (hsml < 0.5) {
    return isMainWorldHost ? moons : null;
  }
  if (hsml < 1.5) {
    return isMainWorldHost ? Math.max(moons, 1) : 0;
  }
  return moons;
};

module.exports = applyMoonRemoval;

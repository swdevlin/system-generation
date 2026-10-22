const { ORBIT_TYPES } = require('../utils');
const { moonOrbitParameters, createMoon } = require('./createMoon');
const RingGenerator = require('../rings/RingGenerator');

const isRing = (def) => (def.uwp || '').toLowerCase() === 'ring';

const assignMoonsFromDefinition = ({ star, stellarObject, body }) => {
  if (![ORBIT_TYPES.GAS_GIANT, ORBIT_TYPES.TERRESTRIAL].includes(stellarObject.orbitType)) return;

  const hasMoonsList = Array.isArray(body.moons);
  if (!hasMoonsList && !body.moonCount && !body.ringCount) return;

  const moonDefs = hasMoonsList
    ? body.moons.filter((d) => !isRing(d))
    : Array.from({ length: body.moonCount || 0 }, () => ({ uwp: 'random' }));
  const ringCount =
    (body.ringCount || 0) + (hasMoonsList ? body.moons.filter(isRing).length : 0);

  if (moonDefs.length === 0 && ringCount === 0) return;

  stellarObject.moonsFromDefinition = true;

  if (ringCount > 0) {
    stellarObject.hasRing = true;
    stellarObject.rings.push(...RingGenerator.generate(ringCount));
  }

  if (moonDefs.length > 0) {
    const { pd, hsml } = moonOrbitParameters(star, stellarObject);
    let mor = Math.floor(hsml) - 2;
    mor = Math.min(mor, 200 + moonDefs.length);
    if (stellarObject.isMainWorldHost && mor < 5) mor = 5;

    for (const moonDef of moonDefs) {
      const kind = (moonDef.uwp || '').toLowerCase();
      if (kind === 'small moon') createMoon({ stellarObject, mor, hsml, pd, size: 'S' });
      else if (kind === 'random') createMoon({ stellarObject, mor, hsml, pd });
      else createMoon({ stellarObject, mor, hsml, pd, uwp: moonDef.uwp });
    }

    stellarObject.moons.sort(
      (a, b) => Math.abs(a.satelliteOrbit.orbit) - Math.abs(b.satelliteOrbit.orbit)
    );
  }
};

module.exports = assignMoonsFromDefinition;

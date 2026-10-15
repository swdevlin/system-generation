const { d2, d6, randomFloat } = require('../dice');
const AtmosphereDensities = require('./AtmosphereDensities');

// Unusual Atmosphere Subtypes (Atmosphere F)
class UnusualAtmosphereGenerator {
  static STANDARD = { min: 0.7, max: 1.49 };

  static SUBTYPES = {
    11: { code: '1', name: 'Dense, Extreme', bar: { min: 10, max: 100 } },
    12: { code: '2', name: 'Dense, Very Extreme', bar: { min: 100, max: 1000 } },
    13: { code: '3', name: 'Dense, Crushing', bar: { min: 1000, max: 10000 } },
    14: { code: '4', name: 'Ellipsoid', bar: { min: 0.1, max: 10 } },
    15: { code: '5', name: 'High Radiation', bar: UnusualAtmosphereGenerator.STANDARD },
    16: { code: '6', name: 'Layered', bar: UnusualAtmosphereGenerator.STANDARD, minGravity: 1.2 },
    21: { code: '7', name: 'Panthalassic', bar: { min: 1.0, max: 100 }, minHydrographics: 10 },
    22: { code: '8', name: 'Steam', bar: { min: 2.5, max: 100 }, minHydrographics: 5 },
    23: { code: '9', name: 'Variable Pressure', bar: { min: 0.1, max: 10 } },
    24: { code: 'A', name: 'Variable Composition', bar: UnusualAtmosphereGenerator.STANDARD },
    25: { code: null, name: 'Combination' },
    26: { code: 'F', name: 'Other', bar: UnusualAtmosphereGenerator.STANDARD },
  };

  static DENSE_CODES = ['1', '2', '3'];

  static rollD26() {
    return d2() * 10 + d6();
  }

  static densityForBar(bar) {
    if (bar < 0.1) return AtmosphereDensities.TRACE;
    if (bar < 0.43) return AtmosphereDensities.VERY_THIN;
    if (bar < 0.7) return AtmosphereDensities.THIN;
    if (bar < 1.5) return AtmosphereDensities.STANDARD;
    if (bar < 2.5) return AtmosphereDensities.DENSE;
    if (bar < 10) return AtmosphereDensities.VERY_DENSE;
    return AtmosphereDensities.EXTREMELY_DENSE;
  }

  // Layered needs gravity above 1.2. Panthalassic and Steam need hydrographics; when it is
  // already known (e.g. from a UWP) it must qualify, otherwise it is forced when rolled later.
  isEligible(subtype, planet) {
    if (subtype.minGravity !== undefined && !(planet.gravity > subtype.minGravity)) return false;
    const hydro = planet.hydrographics?.code;
    if (subtype.minHydrographics !== undefined && hydro !== null && hydro !== undefined)
      return hydro >= subtype.minHydrographics;
    return true;
  }

  // forCombination: rolling one half of a Combination, so Combination and Other are excluded
  rollSubtype(planet, forCombination = false) {
    for (;;) {
      const roll = UnusualAtmosphereGenerator.rollD26();
      const subtype = UnusualAtmosphereGenerator.SUBTYPES[roll];
      if (forCombination && (subtype.code === null || subtype.code === 'F')) continue;
      if (subtype.code !== null && !this.isEligible(subtype, planet)) continue;
      return subtype;
    }
  }

  compatible(a, b) {
    if (a.code === b.code) return false;
    const dense = UnusualAtmosphereGenerator.DENSE_CODES;
    return !(dense.includes(a.code) && dense.includes(b.code));
  }

  generate(star, planet) {
    let subtypes = [this.rollSubtype(planet)];
    if (subtypes[0].code === null) {
      const first = this.rollSubtype(planet, true);
      let second;
      do second = this.rollSubtype(planet, true);
      while (!this.compatible(first, second));
      subtypes = [first, second];
    }

    const bar = Math.max(...subtypes.map((s) => randomFloat(s.bar.min, s.bar.max)));
    const minHydrographics = Math.max(0, ...subtypes.map((s) => s.minHydrographics ?? 0));

    planet.atmosphere.code = 15;
    planet.atmosphere.subtype = subtypes.map((s) => s.code).join('+');
    planet.atmosphere.characteristic = subtypes.map((s) => s.name).join(' + ');
    planet.atmosphere.bar = bar;
    planet.atmosphere.density = UnusualAtmosphereGenerator.densityForBar(bar);
    planet.atmosphere.minHydrographics = minHydrographics || null;
  }
}

module.exports = UnusualAtmosphereGenerator;
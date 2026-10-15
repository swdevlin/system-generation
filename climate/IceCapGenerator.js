const LatitudeTemperature = require('./LatitudeTemperature');
const { SurfaceLiquidsTable } = require('../hydrographics/ExoticLiquidsGenerator');

// Ice caps derived from mean temperature by latitude (page 115)
class IceCapGenerator {
  // Ice caps form where the mean annual temperature is this far below the liquid's melting point.
  // Override with the ICE_CAP_FREEZE_OFFSET environment variable or the constructor.
  static DEFAULT_FREEZE_OFFSET_K = 10;

  static freezeOffsetFromEnv() {
    const offset = parseFloat(process.env.ICE_CAP_FREEZE_OFFSET);
    return Number.isFinite(offset) ? offset : IceCapGenerator.DEFAULT_FREEZE_OFFSET_K;
  }

  constructor(freezeOffsetK = IceCapGenerator.freezeOffsetFromEnv()) {
    this.freezeOffsetK = freezeOffsetK;
  }

  static meltingPoint(liquid) {
    const entry = SurfaceLiquidsTable.find((l) => l.name === liquid);
    return entry ? entry.meltingPointK : null;
  }

  generate(star, planet, latitudeTemperature = new LatitudeTemperature(star, planet)) {
    const liquid = planet.hydrographics?.liquid ?? null;
    const meltingPointK = IceCapGenerator.meltingPoint(liquid);
    const iceCaps = {
      liquid,
      meltingPointK,
      edgeTemperatureK: meltingPointK === null ? null : meltingPointK - this.freezeOffsetK,
      edgeLatitude: null,
      coverage: 0,
      note: null,
    };

    if (!planet.hydrographics?.code || meltingPointK === null) {
      iceCaps.note = 'No surface liquid';
      return iceCaps;
    }

    const edge = latitudeTemperature.latitudeAtTemperature(iceCaps.edgeTemperatureK);
    if (edge !== null) {
      iceCaps.edgeLatitude = Math.round(edge * 10) / 10;
      iceCaps.coverage = Math.round((1 - Math.sin((edge * Math.PI) / 180)) * 1000) / 1000;
    }

    if (planet.tidalLock === '1:1')
      iceCaps.note = 'Tidally locked: latitude model assumes rotation, ice is more likely on the night side';

    return iceCaps;
  }
}

module.exports = IceCapGenerator;
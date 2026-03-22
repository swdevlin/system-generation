const { twoD6, d6 } = require('../dice');
const axialTilt = require('../utils/axialTilt');
const eccentricity = require('../utils/eccentricity');

// Atmosphere codes corresponding to pressure > 2.5 bar
const HIGH_PRESSURE_CODES = new Set([8, 9, 11, 12, 13, 15]);

class TidalLockDetermination {
  constructor(body, star, systemAge) {
    this.body = body;
    this.star = star;
    this.systemAge = systemAge;
  }

  _numericSize() {
    const s = this.body.size;
    return typeof s === 'number' ? s : 0;
  }

  _isHighPressure() {
    return HIGH_PRESSURE_CODES.has(this.body.atmosphere?.code);
  }

  _commonDMs() {
    const dms = {};
    const size = this._numericSize();
    if (size >= 1) dms.size = Math.ceil(size / 3);

    if (this.body.eccentricity > 0.1)
      dms.eccentricity = -Math.floor(this.body.eccentricity * 10);

    const tilt = this.body.axialTilt ?? 0;
    if (tilt > 30) dms.axialTilt30 = -2;
    if (tilt >= 60 && tilt <= 120) dms.axialTilt60_120 = -4;
    if (tilt >= 80 && tilt <= 100) dms.axialTilt80_100 = -4;

    if (this._isHighPressure()) dms.atmosphere = -2;

    if (this.systemAge < 1) dms.systemAge = -2;
    else if (this.systemAge >= 5 && this.systemAge <= 10) dms.systemAge = 2;
    else if (this.systemAge > 10) dms.systemAge = 4;

    return dms;
  }

  _sumDMs(dmsObj) {
    return Object.values(dmsObj).reduce((a, v) => a + v, 0);
  }

  planetToStarCase() {
    const caseDMs = { base: -4 };
    const orbit = this.body.orbit;

    if (orbit < 1) caseDMs.orbit = 4 + Math.floor(10 * (1 - orbit));
    else if (orbit <= 2) caseDMs.orbit = 4;
    else if (orbit <= 3) caseDMs.orbit = 1;
    else caseDMs.orbit = -Math.floor(orbit) * 2;

    const starMass = this.star.mass + (this.star.companion?.mass ?? 0);
    if (starMass < 0.5) caseDMs.starMass = -2;
    else if (starMass <= 1.0) caseDMs.starMass = -1;
    else if (starMass > 2.0 && starMass <= 5.0) caseDMs.starMass = 1;
    else if (starMass > 5.0) caseDMs.starMass = 2;

    const starsOrbited = 1 + (this.star.companion ? 1 : 0);
    if (starsOrbited > 1) caseDMs.multiStar = -starsOrbited;

    const significantMoons = (this.body.moons ?? []).filter(
      (m) => typeof m.size === 'number' && m.size >= 1
    );
    if (significantMoons.length > 0)
      caseDMs.moons = -significantMoons.reduce((s, m) => s + m.size, 0);

    const commonDMs = this._commonDMs();
    const totalDM = this._sumDMs(caseDMs) + this._sumDMs(commonDMs);
    return { name: 'planet-to-star', caseDMs, commonDMs, totalDM, target: 'star', targetBody: null };
  }

  moonToPlanetCase(parentBody) {
    const caseDMs = { base: 6 };
    const orbitPD = this.body.satelliteOrbit?.orbit ?? this.body.orbit;

    if (orbitPD > 20) caseDMs.orbitDistance = -Math.floor(orbitPD / 20);
    if ((this.body.period ?? 0) < 0) caseDMs.retrograde = -2;

    const parentMass = parentBody.mass ?? 0;
    if (parentMass >= 1 && parentMass < 10) caseDMs.parentMass = 2;
    else if (parentMass >= 10 && parentMass < 100) caseDMs.parentMass = 4;
    else if (parentMass >= 100 && parentMass < 1000) caseDMs.parentMass = 6;
    else if (parentMass >= 1000) caseDMs.parentMass = 8;

    const commonDMs = this._commonDMs();
    const totalDM = this._sumDMs(caseDMs) + this._sumDMs(commonDMs);
    return { name: 'moon-to-planet', caseDMs, commonDMs, totalDM, target: 'planet', targetBody: parentBody };
  }

  planetToMoonCase(moon) {
    const caseDMs = { base: -10 };
    const moonSize = typeof moon.size === 'number' ? moon.size : 0;
    if (moonSize >= 1) caseDMs.moonSize = moonSize;

    const orbitPD = moon.satelliteOrbit?.orbit ?? moon.orbit;
    if (orbitPD < 5) caseDMs.moonOrbit = 5 + Math.ceil((5 - orbitPD) * 5);
    else if (orbitPD <= 10) caseDMs.moonOrbit = 4;
    else if (orbitPD <= 20) caseDMs.moonOrbit = 2;
    else if (orbitPD <= 40) caseDMs.moonOrbit = 1;
    else if (orbitPD > 60) caseDMs.moonOrbit = -6;

    const significantMoons = (this.body.moons ?? []).filter(
      (m) => typeof m.size === 'number' && m.size >= 1
    );
    if (significantMoons.length > 1)
      caseDMs.multipleMoons = -(significantMoons.length - 1) * 2;

    const commonDMs = this._commonDMs();
    const totalDM = this._sumDMs(caseDMs) + this._sumDMs(commonDMs);
    return { name: 'planet-to-moon', caseDMs, commonDMs, totalDM, target: 'moon', targetBody: moon };
  }

  apply(caseResult) {
    const { name, caseDMs, commonDMs, totalDM, target, targetBody } = caseResult;
    const body = this.body;

    const logEntry = {
      'Tidal Lock Determination': {
        case: name,
        inputs: this._buildInputs(target, targetBody),
        dms: { ...caseDMs, ...commonDMs, total: totalDM },
        roll: null,
        result: null,
        note: null,
      },
    };
    const log = logEntry['Tidal Lock Determination'];

    if (totalDM <= -10) {
      log.result = { lockType: 'none' };
      log.note = 'Tidal effect auto-failed: total DMs ≤ −10';
      body.buildLog.push(logEntry);
      return;
    }

    if (totalDM >= 10) {
      log.roll = { raw: null, total: 'auto-succeed' };
      this._apply1to1Lock(target, targetBody, log);
      body.buildLog.push(logEntry);
      return;
    }

    const raw = twoD6();
    const total = raw + totalDM;
    log.roll = { raw, total };
    this._applyRollResult(total, target, targetBody, log);
    body.buildLog.push(logEntry);
  }

  _buildInputs(target, targetBody) {
    const b = this.body;
    const inputs = {
      orbit: b.orbit,
      eccentricity: b.eccentricity,
      axialTilt: b.axialTilt,
      size: b.size,
      systemAge: this.systemAge,
      highPressureAtmosphere: this._isHighPressure(),
    };
    if (target === 'star') {
      inputs.starMass = this.star.mass + (this.star.companion?.mass ?? 0);
      inputs.starsOrbited = 1 + (this.star.companion ? 1 : 0);
      const sigMoons = (b.moons ?? []).filter((m) => typeof m.size === 'number' && m.size >= 1);
      inputs.significantMoons = sigMoons.length;
      inputs.totalMoonSize = sigMoons.reduce((s, m) => s + m.size, 0);
    } else if (target === 'planet' && targetBody) {
      inputs.parentMass = targetBody.mass;
      inputs.moonOrbitPD = b.satelliteOrbit?.orbit ?? b.orbit;
      inputs.retrograde = (b.period ?? 0) < 0;
    } else if (target === 'moon' && targetBody) {
      inputs.moonSize = targetBody.size;
      inputs.moonOrbitPD = targetBody.satelliteOrbit?.orbit ?? targetBody.orbit;
    }
    return inputs;
  }

  _applyRollResult(total, target, targetBody, log) {
    const body = this.body;

    if (total <= 2) {
      log.result = { lockType: 'none' };
      log.note = 'No tidal effect';
      return;
    }

    const stretchMultipliers = { 3: 1.5, 4: 2, 5: 3, 6: 5 };
    if (total <= 6) {
      const mult = stretchMultipliers[total];
      const prevRotation = body.rotation;
      body.rotation *= mult;
      body.tidalLock = 'day-stretch';
      body.tidalLockTarget = targetBody ?? this.star;
      body.tidalLockNote = `Tidal braking: day length extended to ${mult}× baseline (${body.rotation.toFixed(1)}h)`;
      log.result = { lockType: 'day-stretch', multiplier: mult, previousRotation: prevRotation, newRotation: body.rotation };
      log.note = body.tidalLockNote;
      return;
    }

    if (total === 7) {
      const roll = d6();
      body.rotation = roll * 5 * 24;
      body.tidalLock = 'prograde';
      body.tidalLockTarget = targetBody ?? this.star;
      body.tidalLockNote = `Tidal drag: slow prograde rotation, day length ${body.rotation}h`;
      log.result = { lockType: 'prograde', diceRoll: roll, newRotation: body.rotation };
      log.note = body.tidalLockNote;
      return;
    }

    if (total === 8) {
      const roll = d6();
      body.rotation = roll * 20 * 24;
      body.tidalLock = 'prograde';
      body.tidalLockTarget = targetBody ?? this.star;
      body.tidalLockNote = `Tidal drag: slow prograde rotation, day length ${body.rotation}h`;
      log.result = { lockType: 'prograde', diceRoll: roll, newRotation: body.rotation };
      log.note = body.tidalLockNote;
      return;
    }

    if (total === 9) {
      const roll = d6();
      body.rotation = roll * 10 * 24;
      body.tidalLock = 'retrograde';
      body.tidalLockTarget = targetBody ?? this.star;
      const prevTilt = body.axialTilt ?? 0;
      if (prevTilt < 90) {
        body.axialTilt = axialTilt();
        this._logAxialTiltReroll(prevTilt, body.axialTilt);
      }
      body.tidalLockNote = `Tidal drag: slow retrograde rotation, day length ${body.rotation}h${body.axialTilt !== prevTilt ? `, axial tilt rerolled to ${body.axialTilt.toFixed(1)}°` : ''}`;
      log.result = { lockType: 'retrograde', diceRoll: roll, newRotation: body.rotation, axialTiltRerolled: body.axialTilt !== prevTilt };
      log.note = body.tidalLockNote;
      return;
    }

    if (total === 10) {
      const roll = d6();
      body.rotation = roll * 50 * 24;
      body.tidalLock = 'retrograde';
      body.tidalLockTarget = targetBody ?? this.star;
      const prevTilt = body.axialTilt ?? 0;
      if (prevTilt < 90) {
        body.axialTilt = axialTilt();
        this._logAxialTiltReroll(prevTilt, body.axialTilt);
      }
      body.tidalLockNote = `Tidal drag: slow retrograde rotation, day length ${body.rotation}h${body.axialTilt !== prevTilt ? `, axial tilt rerolled to ${body.axialTilt.toFixed(1)}°` : ''}`;
      log.result = { lockType: 'retrograde', diceRoll: roll, newRotation: body.rotation, axialTiltRerolled: body.axialTilt !== prevTilt };
      log.note = body.tidalLockNote;
      return;
    }

    if (total === 11) {
      this._apply3to2Lock(target, targetBody, log);
      return;
    }

    // 12+
    this._apply1to1Lock(target, targetBody, log);
  }

  _lockPeriodDays(target, targetBody) {
    if (target === 'star') return this.body.period ?? 0;
    if (target === 'planet') return Math.abs(this.body.period ?? 0);
    if (target === 'moon') return Math.abs(targetBody?.period ?? 0);
    return this.body.period ?? 0;
  }

  _apply3to2Lock(target, targetBody, log) {
    const body = this.body;
    const periodDays = this._lockPeriodDays(target, targetBody);
    body.rotation = periodDays * 24 * (2 / 3);
    body.tidalLock = '3:2';
    body.tidalLockTarget = targetBody ?? this.star;

    const prevTilt = body.axialTilt ?? 0;
    let tiltRerolled = false;
    if (prevTilt > 3) {
      body.axialTilt = (twoD6() - 2) / 10;
      tiltRerolled = true;
      this._logAxialTiltReroll(prevTilt, body.axialTilt);
    }

    const targetDesc = target === 'star' ? 'primary star' : target === 'planet' ? 'parent planet' : 'moon';
    body.tidalLockNote = `3:2 orbital resonance with ${targetDesc}: rotates 3 times per 2 orbits, day length ${body.rotation.toFixed(1)}h${tiltRerolled ? `, axial tilt reduced to ${body.axialTilt.toFixed(1)}°` : ''}`;
    log.result = { lockType: '3:2', newRotation: body.rotation, axialTiltRerolled: tiltRerolled, newAxialTilt: body.axialTilt };
    log.note = body.tidalLockNote;
  }

  _apply1to1Lock(target, targetBody, log) {
    const body = this.body;
    const periodDays = this._lockPeriodDays(target, targetBody);
    body.rotation = periodDays * 24;
    body.siderealDay = body.rotation;
    body.tidalLock = '1:1';
    body.tidalLockTarget = targetBody ?? this.star;
    if (target === 'star') body.twilightZone = true;

    const prevTilt = body.axialTilt ?? 0;
    let tiltRerolled = false;
    if (prevTilt > 3) {
      body.axialTilt = (twoD6() - 2) / 10;
      tiltRerolled = true;
      this._logAxialTiltReroll(prevTilt, body.axialTilt);
    }

    const prevEcc = body.eccentricity ?? 0;
    let eccRerolled = false;
    if (prevEcc > 0.1) {
      const newEcc = eccentricity(-2);
      if (newEcc < prevEcc) {
        body.eccentricity = newEcc;
        eccRerolled = true;
        this._logEccentricityReroll(prevEcc, body.eccentricity);
      }
    }

    const targetDesc = target === 'star' ? 'primary star' : target === 'planet' ? 'parent planet' : 'moon';
    const parts = [`1:1 tidal lock to ${targetDesc}: rotation period ${body.rotation.toFixed(1)}h`];
    if (target === 'star') parts.push('permanent day/night hemispheres, twilight zone at terminator');
    if (tiltRerolled) parts.push(`axial tilt reduced to ${body.axialTilt.toFixed(1)}°`);
    if (eccRerolled) parts.push(`eccentricity reduced to ${body.eccentricity.toFixed(3)}`);
    body.tidalLockNote = parts.join('. ');

    log.result = {
      lockType: '1:1',
      newRotation: body.rotation,
      twilightZone: body.twilightZone,
      axialTiltRerolled: tiltRerolled,
      newAxialTilt: body.axialTilt,
      eccentricityRerolled: eccRerolled,
      newEccentricity: body.eccentricity,
    };
    log.note = body.tidalLockNote;
  }

  _logAxialTiltReroll(prevTilt, newTilt) {
    this.body.buildLog.push({
      'Tidal Lock Axial Tilt Reroll': {
        inputs: { previousAxialTilt: Number(prevTilt.toFixed(2)) },
        result: { newAxialTilt: Number(newTilt.toFixed(2)) },
        note: `Axial tilt reduced by tidal lock from ${prevTilt.toFixed(1)}° to ${newTilt.toFixed(1)}°`,
      },
    });
  }

  _logEccentricityReroll(prevEcc, newEcc) {
    this.body.buildLog.push({
      'Tidal Lock Eccentricity Reroll': {
        inputs: { previousEccentricity: Number(prevEcc.toFixed(4)) },
        result: { newEccentricity: Number(newEcc.toFixed(4)) },
        note: `Eccentricity reduced by 1:1 tidal lock from ${prevEcc.toFixed(3)} to ${newEcc.toFixed(3)}`,
      },
    });
  }
}

module.exports = TidalLockDetermination;

const { AU } = require('./index');
const orbitToAU = require('./orbitToAU');
const { randomFloat } = require('../dice');

function assignPosition(x, obj, orbiting) {
  const eccentricity = obj.eccentricity || 0;
  const inclination = obj.inclination || 0;

  const argumentOfPeriapsis = randomFloat(0, 360);
  const longitudeOfAscendingNode = randomFloat(0, 360);

  // For the simple 2D map, use the longitude of periapsis
  // as the orientation of the orbit.
  const longitudeOfPeriapsis = (longitudeOfAscendingNode + argumentOfPeriapsis) % 360;

  const semiMajorAxis = x;

  const offsetX = orbiting ? orbiting.orbitPosition.x : 0;
  const offsetY = orbiting ? orbiting.orbitPosition.y : 0;

  const offset3dX = orbiting ? orbiting.orbitPosition3d?.x || 0 : 0;
  const offset3dY = orbiting ? orbiting.orbitPosition3d?.y || 0 : 0;
  const offset3dZ = orbiting ? orbiting.orbitPosition3d?.z || 0 : 0;

  // Pick a random point in time, rather than a random geometric
  // angle around the ellipse.
  const meanAnomaly = randomFloat(0, Math.PI * 2);

  // Solve Kepler's equation:
  //
  // M = E - e sin(E)
  //
  // Newton-Raphson converges very quickly for planetary orbits.
  let eccentricAnomaly = meanAnomaly;

  for (let i = 0; i < 6; i++) {
    eccentricAnomaly -=
      (eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly) /
      (1 - eccentricity * Math.cos(eccentricAnomaly));
  }

  // Position in the body's own orbital plane.
  // The primary is at one focus of the ellipse.
  const orbitalX = semiMajorAxis * (Math.cos(eccentricAnomaly) - eccentricity);

  const orbitalY = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2) * Math.sin(eccentricAnomaly);

  // Actual distance from the primary at this point in the orbit.
  const radius = semiMajorAxis * (1 - eccentricity * Math.cos(eccentricAnomaly));

  /*
   * Simple 2D position
   *
   * This deliberately ignores inclination. The orbit is viewed
   * face-on, which is appropriate for the schematic system map.
   */
  const periapsisAngle = degreesToRadians(longitudeOfPeriapsis);

  const mapX = orbitalX * Math.cos(periapsisAngle) - orbitalY * Math.sin(periapsisAngle);

  const mapY = orbitalX * Math.sin(periapsisAngle) + orbitalY * Math.cos(periapsisAngle);

  obj.orbitPosition.x = mapX + offsetX;
  obj.orbitPosition.y = mapY + offsetY;

  /*
   * Complete 3D position
   *
   * Rotate the same orbital position using:
   *
   *   Ω = longitude of ascending node
   *   ω = argument of periapsis
   *   i = inclination
   */
  const omega = degreesToRadians(argumentOfPeriapsis);
  const ascendingNode = degreesToRadians(longitudeOfAscendingNode);
  const inclinationRadians = degreesToRadians(inclination);

  const cosOmega = Math.cos(omega);
  const sinOmega = Math.sin(omega);
  const cosNode = Math.cos(ascendingNode);
  const sinNode = Math.sin(ascendingNode);
  const cosInclination = Math.cos(inclinationRadians);
  const sinInclination = Math.sin(inclinationRadians);

  const position3dX =
    orbitalX * (cosNode * cosOmega - sinNode * sinOmega * cosInclination) -
    orbitalY * (cosNode * sinOmega + sinNode * cosOmega * cosInclination);

  const position3dY =
    orbitalX * (sinNode * cosOmega + cosNode * sinOmega * cosInclination) +
    orbitalY * (cosNode * cosOmega - sinNode * sinOmega * cosInclination);

  const position3dZ = orbitalX * sinOmega * sinInclination + orbitalY * cosOmega * sinInclination;

  obj.orbitPosition3d = {
    x: position3dX + offset3dX,
    y: position3dY + offset3dY,
    z: position3dZ + offset3dZ,
  };

  return {
    au: semiMajorAxis,
    eccentricity,

    argumentOfPeriapsis,
    longitudeOfAscendingNode,
    longitudeOfPeriapsis,
    inclination,

    meanAnomaly,
    eccentricAnomaly,

    radius,
    periapsis: semiMajorAxis * (1 - eccentricity),
    apoapsis: semiMajorAxis * (1 + eccentricity),

    orbitCentreX: offsetX,
    orbitCentreY: offsetY,

    orbitCentre3dX: offset3dX,
    orbitCentre3dY: offset3dY,
    orbitCentre3dZ: offset3dZ,

    parentRadius: orbiting ? orbiting.orbit * AU : 0,

    // Existing schematic coordinates
    x: obj.orbitPosition.x,
    y: obj.orbitPosition.y,

    // Physical 3D coordinates
    x3d: obj.orbitPosition3d.x,
    y3d: obj.orbitPosition3d.y,
    z3d: obj.orbitPosition3d.z,

    orbit: obj.orbit,
    orbitSequence: obj.orbitSequence,
    stellarObject: obj,
    habitableZone: Math.abs(obj.hzcoDeviation) <= 1,
  };
}

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

const orbitPosition = (obj, star) => {
  const x = orbitToAU(obj.orbit) * AU;
  const position = assignPosition(x, obj, star);
  position.habitableZone = Math.abs(obj.hzcoDeviation) <= 1;
  return position;
};

const moonOrbitPosition = (moon, parent) => {
  const x = moon.orbit * parent.diameter;

  const position = assignPosition(x, moon, parent);
  position.habitableZone = Math.abs(parent.hzcoDeviation) <= 1;
  return position;
};

module.exports = {
  orbitPosition,
  moonOrbitPosition,
};

const { AU } = require('./index');
const orbitToAU = require('./orbitToAU');

const randomAngle = () => {
  return Math.random() * 2 * Math.PI;
};

function assignPosition(x, obj, orbiting) {
  const offsetX = orbiting ? orbiting.orbitPosition.x : 0;
  const offsetY = orbiting ? orbiting.orbitPosition.y : 0;
  let y = 0;
  const angle = randomAngle();
  const radius = x;
  obj.orbitPosition.x = x * Math.cos(angle) - y * Math.sin(angle) + offsetX;
  obj.orbitPosition.y = x * Math.sin(angle) + y * Math.cos(angle) + offsetY;

  return {
    au: x,
    radius: radius,
    orbitCentreX: offsetX,
    orbitCentreY: offsetY,
    parentRadius: orbiting.orbit * AU,
    x: obj.orbitPosition.x,
    y: obj.orbitPosition.y,
    orbit: obj.orbit,
    orbitSequence: obj.orbitSequence,
    stellarObject: obj,
    habitableZone: Math.abs(obj.hzcoDeviation) <= 1,
  };
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

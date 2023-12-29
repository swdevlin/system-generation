const {AU} = require("./index");

const randomAngle = () => {
  return Math.random() * 2 * Math.PI;
}

const orbitPosition = (obj, star) => {
  const x = obj.orbit * AU;
  const y = 0;
  const offsetX = star ? star.orbitPosition.x : 0;
  const offsetY = star ? star.orbitPosition.y : 0;

  const angle = randomAngle();
  const radius = x;
  obj.orbitPosition.x = x * Math.cos(angle) - y * Math.sin(angle) + offsetX;
  obj.orbitPosition.y = x * Math.sin(angle) + y * Math.cos(angle) + offsetY;

  return {
    au: x,
    radius: radius,
    orbitCentreX: offsetX,
    orbitCentreY: offsetY,
    parentRadius: star.orbit * AU,
    x: obj.orbitPosition.x,
    y: obj.orbitPosition.y,
    orbit: obj.orbit,
    orbitSequence: obj.orbitSequence,
    stellarObject: obj,
    habitableZone: Math.abs(star.hzco-obj.orbit) <= 1
  }
}

module.exports = orbitPosition;

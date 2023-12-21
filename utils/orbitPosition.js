const {AU} = require("./index");

const randomAngle = () => {
  return Math.random() * 2 * Math.PI;
}

const orbitPosition = (obj, starY) => {
  const x = obj.orbit * AU;
  const y = starY ? starY : 0;

  const angle = randomAngle();
  const radius = x;
  obj.orbitPosition.x = x + radius * Math.cos(angle);
  obj.orbitPosition.y = y + radius * Math.sin(angle);

  return {
    au: x,
    x: obj.orbitPosition.x,
    y: obj.orbitPosition.y,
    orbit: obj.orbit,
    orbitSequence: obj.orbitSequence,
    stellarObject: obj
  }
}

module.exports = orbitPosition;

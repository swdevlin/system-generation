const {AU} = require("./index");
const randomAngle = () => {
  return Math.random() * 2 * Math.PI;
}

const orbitPosition = (obj, starY) => {
  const x = obj.orbit * AU;
  const y = starY ? starY : 0;

  const angle = randomAngle();
  const radius = x;
  return {
    au: x,
    x: x + radius * Math.cos(angle),
    y: y + radius * Math.sin(angle),
    orbit: obj.orbit,
    orbitSequence: obj.orbitSequence,
    stellarObject: obj
  }
}

module.exports = orbitPosition;

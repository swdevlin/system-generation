const {AU} = require("./index");
const randomAngle = () => {
  return Math.random() * 2 * Math.PI;
}

const orbitPosition = (orbit) => {
  const x = orbit * AU;
  const y = 0;

  const angle = randomAngle();
  const radius = x;
  return {
    x: x + radius * Math.cos(angle),
    y: radius * Math.sin(angle),
    orbit: orbit,
    au: x
  }
}

module.exports = orbitPosition;

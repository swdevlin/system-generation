const calculateDistance = (x1, y1, x2, y2) => {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;

  const distanceSquared = deltaX * deltaX + deltaY * deltaY;

  const distance = Math.sqrt(distanceSquared);

  return distance;
}

module.exports = calculateDistance;

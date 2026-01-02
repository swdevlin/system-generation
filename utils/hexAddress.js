
const sectorHexToUniversal = (sector, hex) => {
  const x = Math.floor(hex / 100);
  const y = hex % 100;
  return {
    x: sector.X * 32 + x - 1,
    y: sector.Y * 40 - y + 1,

  };
}

const sectorSolarSystemToUniversal = (sector, solarSystem) => {
  return {
    x: sector.X * 32 + solarSystem.x - 1,
    y: sector.Y * 40 - solarSystem.y + 1,

  };
}

module.exports = {
  toUniversalAddress: sectorSolarSystemToUniversal,
  sectorHexToUniversal: sectorHexToUniversal
}

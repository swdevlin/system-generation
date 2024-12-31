const summaryBlock = (star) => {
  return {
    stellarClass: star.stellarClass,
    stellarType: star.stellarType,
    subtype: star.subtype,
    au: star.au,
    colour: star.colour,
    diameter: star.diameter,
    companion: (star.companion) ? summaryBlock(star.companion) : null,
  }
}

module.exports = summaryBlock;

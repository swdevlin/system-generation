const ringTextDump = (ring, spacing) => {
  return `${' '.repeat(spacing)}Ring centre ${ring.centreLocation.toFixed(2)} PD, span ${ring.span.toFixed(2)} PD\n`;
};

module.exports = ringTextDump;

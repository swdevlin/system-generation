const StarColours = {
  'O': 'blue',
  'B': 'blue',
  'A': '#FFFFF0',
  'F': '#f7e594',
  'G': '#FEDD00',
  'L': '#FA4616',
  'T': 'brown',
  'Y': '#D9017A',
  'K': 'orange',
  'M': 'red',
};

const starColour = (star) => {
  const colour = StarColours[star.stellarType];
  return colour ? colour : 'white';
}

module.exports = {
  starColour: starColour,
  StarColours: StarColours
};

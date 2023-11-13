const travelTime = (kms, mdrive) => {
  const seconds = 2 * Math.sqrt(kms*1000/mdrive);
  let watches = Math.ceil(seconds/(60*60*8));
  let days = Math.floor(watches/3);
  watches -= days*3
  return `${days}d ${watches}w`;
}

module.exports = travelTime;

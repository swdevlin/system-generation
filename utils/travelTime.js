const travelTime = (kms, mdrive, useHours) => {
  const seconds = 2 * Math.sqrt(kms*1000/(mdrive*9.8));
  if (useHours) {
    let minutes = Math.ceil(seconds / 60);
    let hours = Math.floor(minutes/60);
    minutes -= hours*60;
    if (hours > 0)
      return `${hours}h ${minutes}m`;
    else
      return `${minutes}m`;
  } else {
    let watches = Math.ceil(seconds/(60*60*8));
    let days = Math.floor(watches/3);
    watches -= days*3
    return `${days}d ${watches}w`;
  }
}

module.exports = travelTime;

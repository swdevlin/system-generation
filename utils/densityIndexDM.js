const densityIndexDM = (densityIndex) => {
  if (!densityIndex)
    return 0;
  if (densityIndex >= 19)
    return 2;
  else if (densityIndex >= 16)
    return 1;
  else if (densityIndex >= 7 && densityIndex <= 9)
    return -1;
  else if (densityIndex >= 4 && densityIndex <= 6)
    return -2;
  else
    return 0;
}


module.exports = densityIndexDM;

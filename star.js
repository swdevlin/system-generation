class Star {
  stellarClass;
  stellarType;
  subtype;
  mass;
  age;
  luminosity;
  colour;
  companion;
  orbit;
  isCompanion;

  constructor(stellarClass, stellarType) {
    this.stellarClass = stellarClass;
    this.stellarType = stellarType;
    this.isCompanion = false;
  }
}

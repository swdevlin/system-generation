class Atmosphere {
  constructor() {
    this._code = 0;
    this.irritant = false;
    this.taint = false;
    this.characteristic = '';
    this.bar = 0;
    this.gasType = null;
  }

  get code() {
    return this._code;
  }

  set code(c) {
    this._code = c;
    this.taint = [2,4,7,9].includes(c);
  }

}

module.exports = Atmosphere;

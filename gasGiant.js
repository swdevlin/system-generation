const {ORBIT_TYPES} = require("./utils");

class GasGiant {
  constructor(code, diameter, mass, orbit) {
    this.code = code;
    this.diameter = diameter;
    this.mass = mass;
    this.orbit = orbit;
    this.moons = [];
    this.orbitType = ORBIT_TYPES.GAS_GIANT;
  }

  textDump(spacing, prefix, postfix) {
    let s = `${' '.repeat(spacing)}${prefix}${this.orbit.toFixed(2)} `;
    if (this.code === 'GS')
      s+= 'Small gas giant';
    else if (this.code === 'GM')
      s+= 'Medium gas giant';
    else if (this.code === 'GL')
      s+= 'Large gas giant';
    s += `${postfix}\n`;
    return s;
  }
}

module.exports = GasGiant;

const {ORBIT_TYPES, orbitText} = require("../utils");
const {moonTextDump, moonHTMLDump} = require("../moons");

class GasGiant {
  constructor(code, diameter, mass, orbit) {
    this.code = code;
    this.diameter = diameter;
    this.mass = mass;
    this.eccentricity = 0;
    this.orbit = orbit;
    this.moons = [];
    this.hasRing = false;
    this.orbitType = ORBIT_TYPES.GAS_GIANT;
    this.trojanOffset = null;
    this.axialTilt = 0;
  }

  textDump(spacing, prefix, postfix) {
    let s = `${' '.repeat(spacing)}${prefix}${orbitText(this.orbit)} `;
    if (this.code === 'GS')
      s+= 'Small gas giant';
    else if (this.code === 'GM')
      s+= 'Medium gas giant';
    else if (this.code === 'GL')
      s+= 'Large gas giant';
    s += `${postfix}\n`;
    for (const moon of this.moons)
      s += moonTextDump(moon, spacing+2);
    return s;
  }

  htmlDump(additionalClass) {
    if (additionalClass === undefined)
      additionalClass = '';
    let lines = [];
    let s = `<span class="orbit">${orbitText(this.orbit)}</span> `;
    if (this.code === 'GS')
      s += 'Small gas giant';
    else if (this.code === 'GM')
      s += 'Medium gas giant';
    else if (this.code === 'GL')
      s += 'Large gas giant';
    if (this.moons.length > 0) {
      let moonHtml = ['<ul>'];
      for (const moon of this.moons)
        moonHtml = moonHtml.concat(moonHTMLDump(moon));
      moonHtml.push('</ul>');
      lines.push(`<li class="${this.code} ${additionalClass}">${s}<ul>${moonHtml.join('\n')}</ul></li>`);
    } else {
      lines.push(`<li class="${this.code} ${additionalClass}">${s}</li>`);
    }
    return lines;
  }
}

module.exports = GasGiant;

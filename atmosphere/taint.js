const {twoD6} = require("../dice");

const TaintSeverity = Object.freeze({
  NONE: 0,
  TRIVIAL: 1,
  SURMOUNTABLE: 2,
  MINOR: 3,
  MAJOR: 4,
  SERIOUS: 5,
  HAZARDOUS: 6,
  LONG_TERM_LETHAL: 7,
  INEVITABLY_LETHAL: 8,
  RAPIDLY_LETHAL: 9,
});

const TaintPersistence = Object.freeze({
  NONE: 0,
  OCCASIONAL_AND_BRIEF: 2,
  OCCASIONAL_AND_LINGERING: 3,
  IRREGULAR: 4,
  FLUCTUATING: 5,
  VARYING_6: 6,
  VARYING_4: 7,
  VARYING_2: 8,
  CONSTANT: 9,
});

class Taint {
  constructor() {
    this.subtype = '';
    this.code = '';
    this.severity = TaintSeverity.NONE;
    this.persistence = TaintPersistence.NONE;
  }
}

// page 82
const determineTaint = (atmosphere) => {

  let taint = new Taint();

  let severityDM = atmosphere.code === 12 ? 6 : 0;
  let persistenceDM = atmosphere.code === 12 ? 6 : 0;

  let roll = twoD6();
  if (atmosphere.code === 4)
    roll -= 2;
  else if (atmosphere.code === 9)
    roll += 2;
  if (roll <= 2) {
    taint.subtype = 'Low Oxygen';
    taint.code = 'L';
    severityDM += 4;
    persistenceDM += 4;
  } else if (roll >= 12) {
    taint.subtype = 'High Oxygen';
    taint.code = 'H';
    severityDM += 4;
    persistenceDM += 4;
  } else
    switch (roll) {
      case 3:
      case 11:
        taint.subtype = 'Radioactivity';
        taint.code = 'R';
        break;
      case 4:
      case 9:
        taint.subtype = 'Biological';
        taint.code = 'B';
        break;
      case 5:
      case 7:
        taint.subtype = 'Gas Mix';
        taint.code = 'G';
        break;
      case 8:
        taint.subtype = 'Sulphur Compounds';
        taint.code = 'S';
        break;
      case 10:
        taint.subtype = 'Particulates';
        taint.code = 'P';
        break;
    }

  roll = twoD6() + severityDM;
  if (roll <= 4)
    taint.severity = TaintSeverity.TRIVIAL;
  else if (roll >= 12)
    taint.severity = TaintSeverity.RAPIDLY_LETHAL;
  else
    switch (roll) {
      case 5: taint.severity = TaintSeverity.SURMOUNTABLE; break;
      case 6: taint.severity = TaintSeverity.MINOR; break;
      case 7: taint.severity = TaintSeverity.MAJOR; break;
      case 8: taint.severity = TaintSeverity.SERIOUS; break;
      case 9: taint.severity = TaintSeverity.HAZARDOUS; break;
      case 10: taint.severity = TaintSeverity.LONG_TERM_LETHAL; break;
      case 11: taint.severity = TaintSeverity.INEVITABLY_LETHAL; break;
    }

  if (taint.severity >= TaintSeverity.INEVITABLY_LETHAL)
    persistenceDM += 2;
  roll = twoD6() + persistenceDM;
  if (roll <= 2)
    taint.persistence = TaintPersistence.OCCASIONAL_AND_BRIEF;
  else if (roll >= 9)
    taint.persistence = TaintPersistence.CONSTANT;
  else
    taint.persistence = roll;

  return taint;
}

module.exports = {
  Taint: Taint,
  determineTaint: determineTaint,
  TaintSeverity: TaintSeverity,
  TaintPersistence: TaintPersistence,
};

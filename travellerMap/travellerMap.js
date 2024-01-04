
class TravellerMap {
  constructor(sectorName) {
    this.systems = [];
    this.refereeSystems = [];
    this.sectorName = sectorName;
    this.X = 0;
    this.Y = 0;
    this.subSectors = {};
    this.abbreviation = '';
    this.regions = [];
    this.nativeSophonts = [];
    this.extinctSophonts = [];
  }

  sep = '\t';

  systemDump(referee) {
    let output = 'Hex\tName\tUWP\tBases\tRemarks\tZone\tPBG\tAllegiance\tStars\t{Ix}\t(Ex)\t[Cx]\tNobility\tW\n';
    if (referee)
      output += this.refereeSystems.join('\n');
    else
      output += this.systems.join('\n');
    return output;
  }

  metaDataDump(referee) {
    return `<?xml version="1.0"?>
    <Sector xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" Tags="MTU" Abbreviation="${this.abbreviation}">
      <Name>${this.sectorName}</Name>
      <Credits><![CDATA[
        <b>${this.sectorName}</b> sector was designed by RadioFreeWABA for a Deepnight Endeavour campaign.
      ]]></Credits>
      <X>${this.X}</X>
      <Y>${this.Y}</Y>
      <DataFile Author="RadioFreeWABA" Source="Custom" Milieu="M1105" />
      <Subsectors>
        <Subsector Index="A">${this.subSectors.A}</Subsector>
        <Subsector Index="B">${this.subSectors.B}</Subsector>
        <Subsector Index="C">${this.subSectors.C}</Subsector>
        <Subsector Index="D">${this.subSectors.D}</Subsector>
        <Subsector Index="E">${this.subSectors.E}</Subsector>
        <Subsector Index="F">${this.subSectors.F}</Subsector>
        <Subsector Index="G">${this.subSectors.G}</Subsector>
        <Subsector Index="H">${this.subSectors.H}</Subsector>
        <Subsector Index="I">${this.subSectors.I}</Subsector>
        <Subsector Index="J">${this.subSectors.J}</Subsector>
        <Subsector Index="K">${this.subSectors.K}</Subsector>
        <Subsector Index="L">${this.subSectors.L}</Subsector>
        <Subsector Index="M">${this.subSectors.M}</Subsector>
        <Subsector Index="N">${this.subSectors.N}</Subsector>
        <Subsector Index="O">${this.subSectors.O}</Subsector>
        <Subsector Index="P">${this.subSectors.P}</Subsector>
      </Subsectors>
      <Allegiances>
        <Allegiance Code="NaHu" Base="Na">Non-Aligned, Human-dominated</Allegiance>
        <Allegiance Code="NS" Base="Ns">New Sophont</Allegiance>
     </Allegiances>
    <Borders></Borders>
    ${this.regionDump(referee)}
    <Routes></Routes>
  </Sector>`
  }

  regionDump(referee) {
    if (this.regions.length === 0 && this.extinctSophonts.length === 0 && this.nativeSophonts.length === 0)
      return '';
    let xml = '<Regions>\n'
    for (const region of this.regions) {
      xml += `<Region Color="${region.Color}" LabelPosition="${region.LabelPosition}" Label="${region.Label}">`;
      xml += region.parsecs.join(' ');
      xml += '</Region>\n'
    }
    if (referee) {
      for (const system of this.nativeSophonts) {
        xml += `<Region Color="#87CEEB">${system.coordinates}</Region>\n`;
      }
      for (const system of this.extinctSophonts) {
        xml += `<Region Color="#CD5C5C">${system.coordinates}</Region>\n`;
      }
    }
    xml += '</Regions>\n';
    return xml;
  }

  addSystem(solarSystem) {
    const mw = solarSystem.mainWorld;

    // hex
    let line = solarSystem.coordinates + this.sep;
    // name
    if (solarSystem.name)
      line += solarSystem.name + this.sep;
    else
      line += `${solarSystem.starsString()}${this.sep}`;

    // uwp
    if (solarSystem.known)
      line += mw ? mw.uwp + this.sep : '???????-?';
    else
      line += '???????-?' + this.sep;
    // bases
    line += solarSystem.bases + this.sep;
    // remarks
    line += solarSystem.remarks + this.sep;
    // zone
    line += '' + this.sep;
    // PBG
    line += '0' + solarSystem.planetoidBelts + solarSystem.gasGiants + this.sep;
    // allegiance
    line += '' + this.sep;
    // Stars
    let stars = ''
    for (const star of solarSystem.stars) {
      stars += `${star.stellarType}${star.subtype? star.subtype : ''} ${star.stellarClass} `
    }
    line += stars + this.sep;
    // importance
    line += '{}' + this.sep;
    // Economic
    line += '()' + this.sep;
    // Cultural
    line += '[]' + this.sep;
    // nobility
    line += this.sep;
    // worlds
    line += solarSystem.terrestrialPlanets;
    this.systems.push(line);

    if (mw)
      line = line.replace('???????-?', mw.uwp);
    if (solarSystem.hasNativeSophont) {
      this.nativeSophonts.push(solarSystem);
      // line = line.replace(solarSystem.starsString(), '');
    } else if (solarSystem.hasExtinctSophont)
      this.extinctSophonts.push(solarSystem);
    if (mw)
      line = line.replace(solarSystem.starsString(), mw.uwp);
    // line = line.replace(solarSystem.starsString(), ' ');
    this.refereeSystems.push(line);
  }

}

module.exports = TravellerMap;

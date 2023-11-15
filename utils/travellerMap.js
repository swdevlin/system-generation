
class TravellerMap {
  constructor(sectorName) {
    this.systems = [];
    this.sectorName = sectorName;
    this.X = 0;
    this.Y = 0;
    this.subSectors = {};
    this.abbreviation = '';
    this.regions = []
  }

  sep = '\t';

  systemDump() {
    let output = 'Hex\tName\tUWP\tBases\tRemarks\tZone\tPBG\tAllegiance\tStars\t{Ix}\t(Ex)\t[Cx]\tNobility\tW\n';
    output += this.systems.join('\n');
    return output;
  }

  metaDataDump() {
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
     </Allegiances>
    <Borders>
    </Borders>
    ${this.regionDump()}
    <Routes>
    </Routes>
  </Sector>`
  }

  regionDump() {
    if (this.regions.length === 0)
      return '';
    let xml = '<Regions>\n'
    for (const region of this.regions) {
      xml += `<Region Color="${region.Color}" LabelPosition="${region.LabelPosition}" Label="${region.Label}">`;
      xml += region.parsecs.join(' ');
      xml += '</Region>\n'
    }
    xml += '</Regions>\n';
    return xml;
  }

  addSystem(solarSystem) {
    // hex
    let line = solarSystem.coordinates + this.sep;
    // name
    line += this.sep;
    // uwp
    line += '???????-?' + this.sep;
    // bases
    line += this.sep;
    // remarks
    line += this.sep;
    // zone
    line += '-' + this.sep;
    // PBG
    line += '0' + solarSystem.planetoidBelts + solarSystem.gasGiants + this.sep;
    // allegiance
    line += '-' + this.sep;
    // Stars
    let stars = ''
    for (const star of solarSystem.stars) {
      stars += `${star.stellarType}${star.subtype} ${star.stellarClass} `
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
  }

}

module.exports = TravellerMap;

const {writeFileSync} = require("fs");

const SectorGrid = 0x0001;          // 1
const SubsectorGrid = 0x0002;       // 2
const SectorsSelected = 0x0004;     // 4
const SectorsAll = 0x0008;          // 8
const BordersMajor = 0x0010;        // 16
const BordersMinor = 0x0020;        // 32
const NamesMajor = 0x0040;          // 64
const NamesMinor = 0x0080;          // 128
const WorldsCapitals = 0x0100;      // 256
const WorldsHomeworlds = 0x0200;    // 512
const ForceHexes = 0x2000;          // 8192
const WorldColors = 0x4000;         // 16384
const FilledBorders = 0x8000;       // 32768


async function createMap({systems, meta, mapDir , sectorName , forReferee}) {
  const params = {
    data: systems,
    metadata: meta,
    accept: 'image/svg+xml',
    style: 'print',
  };

  if (forReferee) {
    params.options = SectorGrid | SubsectorGrid | SectorsSelected | BordersMajor | BordersMinor | NamesMajor | NamesMinor;
    // params.options = 49159;
    params.scale = 64;
  } else {
    params.options = SectorGrid | SubsectorGrid | SectorsSelected | BordersMajor | BordersMinor | NamesMajor | NamesMinor;
    // params.options = 8439;
    params.scale = 96;
  }

  const response = await fetch('https://travellermap.com/api/poster', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(params)
  });
  const blob = await response.text();
  writeFileSync(`${mapDir}/${sectorName}.svg`, blob);
}

module.exports = createMap;

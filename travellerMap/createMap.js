const {writeFileSync} = require("fs");

async function createMap({systems, meta, mapDir, sectorName, forReferee}) {
  const options = forReferee ? 49159 : 8439;
  const response = await fetch('https://travellermap.com/api/poster', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      data: systems,
      metadata: meta,
      accept: 'image/svg+xml',
      style: 'print',
      options: options
    })
  });
  const blob = await response.text();
  writeFileSync(`${mapDir}/${sectorName}.svg`, blob);
}

module.exports = createMap;

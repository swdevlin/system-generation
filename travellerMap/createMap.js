const {writeFileSync} = require("fs");

async function createMap({systems, meta, mapDir, sectorName, forReferee}) {
  const params = {
    data: systems,
    metadata: meta,
    accept: 'image/svg+xml',
    style: 'print',
  };

  if (forReferee) {
    params.options = 9207;
    // params.options = 49159;
  } else {
    params.options = 8439;
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

/*
      style: 'fasa',
      stellar: 1,
      scale: 96,

 */

import fs from "fs";

async function createMap(systems, meta, mapDir, sectorName) {
  const response = await fetch('https://travellermap.com/api/poster', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      data: systems,
      metadata: meta,
      accept: 'image/svg+xml',
      style: 'atlas',
      options: 8395
    })
  });
  const blob = await response.text();
  fs.writeFileSync(`${mapDir}/${sectorName}.svg`, blob);
}

module.exports = createMap;

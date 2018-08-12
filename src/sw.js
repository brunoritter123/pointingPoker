const VERSION = "Scrum_Poker_v1";

function log(messagens) {
  console.log(VERSION, messagens)
}

log("installing service worker");


self.addEventListener('install', event => {
  event.waitUntil( self.skipWaiting() );
});

/*
async function installServiceWorker() {
  log("Service Worder installation started");
  const request = new Request("offline.html");
  const response = await fetch(request);

  log("response received after loading offline.html", response);

  if (response.status !== 200) {
    throw new Error("Could not load offline page!");
  }
}
*/

self.addEventListener("activate", (event) => {
  event.waitUntil( self.clients.claim() );
});

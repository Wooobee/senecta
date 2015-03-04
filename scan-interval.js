var noble = require('noble');

var RSSI_THRESHOLD    = -90;
var EXIT_GRACE_PERIOD = 2000; // milliseconds

var inRange = [];

noble.on('discover', function(peripheral) {
  if (peripheral.rssi < RSSI_THRESHOLD) {
    // ignore
    return;
  }

  var uuid = peripheral.uuid;
  var entered = !inRange[uuid];

  if (entered) {
    inRange[uuid] = {
      peripheral: peripheral
    };

    console.log('"' + peripheral.advertisement.localName + '" entered (RSSI ' + peripheral.rssi + ') ' + new Date());
  }

  inRange[uuid].lastSeen = Date.now();
});

setInterval(function() {
  for (var uuid in inRange) {
    if (inRange[uuid].lastSeen < (Date.now() - EXIT_GRACE_PERIOD)) {
      var peripheral = inRange[uuid].peripheral;

      console.log('"' + peripheral.advertisement.localName + '" exited (RSSI ' + peripheral.rssi + ') ' + new Date());

      delete inRange[uuid];
    }
  }
}, EXIT_GRACE_PERIOD / 2);

noble.startScanning([], true);
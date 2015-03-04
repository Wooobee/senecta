
var noble = require('noble'),
    AWS = require('aws-sdk'),
    Promise = require('bluebird');

AWS.config.loadFromPath('./config.json'); 


var serviceUUIDs = []; // default: [] => all
var allowDuplicates = false; // default: false

var sns = new AWS.SNS();



noble.on('discover', function(peripheral) { 
 
  var macAddress = peripheral.uuid;
  var rss = peripheral.rssi;
  var localName = peripheral.advertisement.localName; 
  var serviceDataUUIDs = peripheral.advertisement.serviceData
  console.log('found device: ',macAddress, ' ', localName, ' ', rss, ' ', serviceDataUUIDs); 

  var params = {  
  TopicArn : "arn:aws:sns:eu-central-1:333855826946:beacon_log",
  Message: "{'uuid': macAddress, 'rssi': rss}" 
  }; 

  sns.publish(params, publishCallback); 
});



function publishCallback(err, data) {
  console.log("published message");
  console.log(data);
}

noble.startScanning([], true);
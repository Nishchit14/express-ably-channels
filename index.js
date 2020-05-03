const si = require("systeminformation")
const http = require("https");

const CONSTANTS = {
  CHANNEL_NAME: "express-server-info",
  EVENT_BATTERY_STATUS: "ON_BATTERY_STATUS",
  EVENT_CPU_TEMP: "ON_CPU_TEMP",
  EVENT_CPU_MEM: "ON_CPU_MEM",
  EVENT_NETWORK_STATS: "ON_NETWORK_STATS",
  EVENT_DISK_IO_STATS: "ON_DISK_IO_STATS"
}

/**
 * Fetching System Information
 * @param ablyKey       - ably key
 * @param interval      - interval to send request
 * @returns {Function}  - express middleware function
 */
module.exports = (ablyKey, channelName=CONSTANTS.CHANNEL_NAME, interval=5000) => {
  
  setInterval(() => {
    si.battery()
      .then(data => {
        data.maxcapacity = data.maxcapacity / 1000000
        data.currentcapacity = data.currentcapacity / 1000000
        data["unit"] = "Wh"
        request(data, ablyKey, channelName, CONSTANTS.EVENT_BATTERY_STATUS)
      })
      .catch(error => console.log(error));

    si.cpuTemperature().then(data => {
      request(data, ablyKey, channelName, CONSTANTS.EVENT_CPU_TEMP)
    })

    si.mem().then(data => {
      data["unit"] = "Byte"
      request(data, ablyKey, channelName, CONSTANTS.EVENT_CPU_MEM)
    })

    si.networkStats().then(data => {
      data[0]["unit"] = "Byte"
      request(data, ablyKey, channelName, CONSTANTS.EVENT_NETWORK_STATS)
    })
    si.disksIO().then(data => {

      data.rIO = data.rIO / 1e+6
      data.wIO = data.wIO / 1e+6
      data.tIO = data.tIO / 1e+6
      data.rIO_sec = data.rIO_sec / 1e+6
      data.wIO_sec = data.wIO_sec / 1e+6
      data.tIO_sec = data.tIO_sec / 1e+6
      data["unit"] = "Mb"
      request(data, ablyKey, channelName, CONSTANTS.EVENT_DISK_IO_STATS)
    })
  }, interval)

  return  (req, res) => {

  }
}


/**
 * Sending request to ably channel via `http`
 * @param data
 * @param key
 * @param ablyEvent
 */
let request = (data, key, channelName, ablyEvent) => {

  let options =
    {
      "method": "POST",
      "hostname": "rest.ably.io",
      "port": null,
      "path": `/channels/${channelName}/messages`,
      "headers": {
        "content-type": "application/json",
        "Authorization": `Basic ${Buffer.from(key).toString("base64")}`
      }
    };

  let req = http.request(options, function (res) {
    let chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      let body = Buffer.concat(chunks);
      // console.log(body.toString());
    });
  });

  req.write(JSON.stringify({name: ablyEvent, data: data}));
  req.end();
}
const si = require("systeminformation")
const http = require("https");

/**
 * Sending request to ably channel via `http`
 * @param data
 * @param key
 * @param ablyEvent
 */
let request = (data, key, ablyEvent) => {

  let options =
    {
      "method": "POST",
      "hostname": "rest.ably.io",
      "port": null,
      "path": "/channels/Tooling/messages",
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
      console.log(body.toString());
    });
  });

  req.write(JSON.stringify({name: ablyEvent, data: data}));
  req.end();
}

/**
 * Fetching System Information
 * @param interval      - interval to send request
 * @param ablyKey       - ably key
 * @returns {Function}  - express middleware function
 */
module.exports = (interval, ablyKey) => {
  setInterval(() => {
    si.battery()
      .then(data => {
        data.maxcapacity = data.maxcapacity / 1000000
        data.currentcapacity = data.currentcapacity / 1000000
        data["unit"] = "Wh"
        request(data, ablyKey, "onBatteryStats")
      })
      .catch(error => console.log(error));

    si.cpuTemperature().then(data => {
      request(data, ablyKey, "onCPUTemp")
    })

    si.mem().then(data => {
      data["unit"] = "Byte"
      request(data, ablyKey, "onCPUMem")
    })

    si.networkStats().then(data => {
      data[0]["unit"] = "Byte"
      request(data, ablyKey, "onNetworkStats")
    })
    si.disksIO().then(data => {

      data.rIO = data.rIO / 1e+6
      data.wIO = data.wIO / 1e+6
      data.tIO = data.tIO / 1e+6
      data.rIO_sec = data.rIO_sec / 1e+6
      data.wIO_sec = data.wIO_sec / 1e+6
      data.tIO_sec = data.tIO_sec / 1e+6
      data["unit"] = "Mb"
      request(data, ablyKey, "onDiskIOStats")
    })
  }, interval)

  return  (req, res) => {

  }
}

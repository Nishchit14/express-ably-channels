# Express server's info middleware by AblyChannels
An express middleware for AblyChannels to gather the express server information and send them to the `express-ably` (default) channel. so all the subscribed clients can receive this server information.

### Install 

**npm**
`npm i express-ably-channels`

**yarn**
`yarn add express-ably-channels`

### Usage and config

```javascript

var express = require('express');
var expressAblyChannels = require('express-ably-channels');
var app = module.exports = express();

const CHANNEL_NAME = "express-server-info";
const INTERVAL = 5000; // send server information to channel on every 5 sec interval

/**
* @param: key: ably key
* @param: channel name: name of ably channel
* @param: interval: in millisecond, fetch system information  periodically
**/
app.use(expressAblyChannels(process.env.ABLY_KEY, CHANNEL_NAME, INTERVAL))

app.listen(3001, "localhost");

```

#### Middleware params
| Param | Required? | Default Valye | Description |
|-|-| - | - |
| Ably Key | yes| - | Your Ably Key |
| Channel Name | no  | `express-server-info` | Give any custom `channel name` here|
| Interval | no | 5000 | Interval in milliseconds will send the server infomation to AblyChannel on specified value. |

#### How to subscibe the Channel's events to receive the server information?

**Step-1**
 - Connect AblyChannel which you have set in `express-ably-channels` middleware. 
 ```js
 const CHANNEL_NAME = "express-server-info";
 let ably = new require('ably').Realtime("ably_key_here");
 let channelServerInfo = ably.channels.get(CHANNEL_NAME);
  
 ...
 ```

**Step-2**
 - Subscribe to the events to receive server's specific information.

| Event name | Description |
| - | - |
| ON_BATTERY_STATUS | subscribe for battery status |
| ON_CPU_TEMP | subscribe for CPU temprature |
| ON_CPU_MEM | subscribe for CPU memory|
| ON_NETWORK_STATS | subscribe for network stats |
| ON_DISK_IO_STATS | subscribe for Disk IO stats |

Like...
```js
channelServerInfo.subscribe('ON_BATTERY_STATUS', (message) => {
    console.log(message)
}

channelServerInfo.subscribe('ON_DISK_IO_STATS', (message) => {
    console.log(message)
}

...
```

### Run Example?
1. clone this repo
2. install dependancies `npm i` or `yarn`
3. run server `node example/server.js`
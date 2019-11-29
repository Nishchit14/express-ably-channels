# express-ably-channels
An express middleware for AblyChannels

### install 

**npm**
`npm i express-ably-channels`

**yarn**
`yarn add express-ably-channels`

### config

```

var express = require('express');
var expressAblyChannels = require('express-ably-channels');
var app = module.exports = express();

/**
* @interval: in millisecond, fetch system information periodically
* @key: ably key
**/
app.use(expressAblyChannels(5000, "ably-key-here"))

app.listen(3001, "localhost");

```

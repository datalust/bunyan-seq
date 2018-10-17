# bunyan-seq [![Build status](https://ci.appveyor.com/api/projects/status/mrcbbrd33prih7bb?svg=true)](https://ci.appveyor.com/project/datalust/bunyan-seq) [![NPM](https://img.shields.io/npm/v/bunyan-seq.svg)](https://www.npmjs.com/package/bunyan-seq)


A Bunyan stream to send events to [Seq](https://getseq.net). Tested with Node.js versions 4.2.2 and up.

### Usage

Use the `createStream()` method to create a Bunyan stream configuration, passing `serverUrl`, `apiKey` and batching parameters.

```js
let bunyan = require('bunyan');
let seq = require('bunyan-seq');

var log = bunyan.createLogger({
    name: 'myapp',
    streams: [
        {
            stream: process.stdout,
            level: 'warn',
        },
        seq.createStream({
            serverUrl: 'http://localhost:5341',
            level: 'info'
        })
    ]
});

log.info('Hi!');
log.warn({lang: 'fr'}, 'Au revoir');
```

You can specify property names as tokens in the log message to control how the event is rendered in Seq:

```js
// Seq will render this as 'Hi, Alice!'
log.info({user: 'Alice'}, 'Hi, {user}!');
```

Read the [complete documentation](https://docs.getseq.net/docs/using-nodejs).

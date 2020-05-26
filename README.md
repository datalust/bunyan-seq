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
      level: 'warn'
    },
    seq.createStream({
      serverUrl: 'http://localhost:5341',
      level: 'info'
    })
  ]
});

log.info('Hi!');
log.warn({ lang: 'fr' }, 'Au revoir');
```

You can specify property names as tokens in the log message to control how the event is rendered in Seq:

```js
// Seq will render this as 'Hi, Alice!'
log.info({ user: 'Alice' }, 'Hi, {user}!');
```

### Out-of-process (transport) usage

First, install `bunyan-seq` as a global tool:

```shell
npm install -g bunyan-seq
```

Then, pipe the output of your bunyan-enabled app to it:

```shell
node your-app.js | bunyan-seq --serverUrl http://localhost:5341 --apiKey 1234567890
```

`bunyan-seq` accepts the following parameters:

- `serverUrl` - this is the base URL of your Seq server; if omitted, the default value of `http://localhost:5341` will be used
- `apiKey` - your Seq API key, if one is required; the default does not send an API key
- `logOtherAs` - log other output (not formatted through bunyan) to seq at this loglevel. Useful to capture messages if the node process crashes or smilar.

#### Capturing other output

To enable capture of output not formatted through bunyan use the `logOtherAs` parameter. It's possible to use different settings for STDOUT/STDERR like this, when using bash:

```shell
node your-app.js 2> >(bunyan-seq --logOtherAs Error --serverUrl http://localhost:5341 --apiKey 1234567890) > >(bunyan-seq --logOtherAs Information --serverUrl http://localhost:5341 --apiKey 1234567890)
```

Read the [complete documentation](https://docs.getseq.net/docs/using-nodejs).

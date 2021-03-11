# bunyan-seq ![Build](https://github.com/datalust/bunyan-seq/workflows/Test/badge.svg) ![Publish](https://github.com/datalust/bunyan-seq/workflows/Publish/badge.svg) [![NPM](https://img.shields.io/npm/v/bunyan-seq.svg)](https://www.npmjs.com/package/bunyan-seq)

A Bunyan stream to send events to [Seq](https://datalust.co/seq). Tested with Node.js versions 4.2.2 and up.

## Usage

First, install `bunyan-seq` as a global tool:

```shell
npm install -g bunyan-seq
```

Then, pipe the output of your bunyan-enabled app to it:

```shell
node your-app.js | bunyan-seq --serverUrl http://localhost:5341 --apiKey 1234567890  --property application=ExampleApp
```

`bunyan-seq` accepts the following parameters:

- `serverUrl` - this is the base URL of your Seq server; if omitted, the default value of `http://localhost:5341` will be used
- `apiKey` - your Seq API key, if one is required; the default does not send an API key
- `logOtherAs` - log other output (not formatted through bunyan) to seq at this loglevel. Useful to capture messages if the node process crashes or smilar.
- `property` - add additional properties to all logs sent to Seq

### Structured logging with message templates

You can specify property names as tokens in the log message to control how the event is rendered in Seq:

```js
// Seq will render this as 'Hi, Alice!'
log.info({ user: 'Alice' }, 'Hi, {user}!');
```

The full message template syntax is documented [here](https://messagetemplates.org).

### Capturing other output

To enable capture of output not formatted through bunyan use the `logOtherAs` parameter. It's possible to use different settings for `STDOUT`/`STDERR` like this, when using bash:

```shell
node your-app.js `
    2> >(bunyan-seq --logOtherAs Error --serverUrl http://localhost:5341 --apiKey 1234567890) `
    > >(bunyan-seq --logOtherAs Information --serverUrl http://localhost:5341 --apiKey 1234567890)
```

## In-process usage

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
      level: 'info',
      reemitErrorEvents: true,
      onError: (e) => {
        console.error('[SeqStreamCustomError] failed to log events:', e);
      }
    })
  ]
});

log.info('hi');
log.warn({ lang: 'fr' }, 'au revoir');
```

Read the [complete documentation](https://docs.datalust.co/docs/using-nodejs).

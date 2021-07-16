import { createLogger } from "bunyan";
import { createStream } from "../index";

var log = createLogger({
  name: 'myapp',
  streams: [
    {
      stream: process.stdout,
      level: 'warn'
    },
    createStream({
      serverUrl: 'http://localhost:5341',
      level: 'info',
      reemitErrorEvents: true,
      onError(e) {
        console.error('[SeqStreamCustomError] failed to log events:', e);
      }
    })
  ]
});

log.info('hi');
log.warn({ lang: 'fr' }, 'au revoir');

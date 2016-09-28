"use strict";

let bunyan = require('bunyan');
let seq = require('../index');

var log = bunyan.createLogger({
    name: 'myapp',
    streams: [
        {
            stream: process.stdout,
            level: 'warn',
        },
        seq.createStream({
            serverUrl: 'http://localhost:5341',
            level: 'info',
            reemitErrorEvents: true
        })
    ]
});

log.on('error', function(err, stream){
    console.log('Logging failed:', err);
});

log.info('hi');
log.warn({lang: 'fr'}, 'au revoir');


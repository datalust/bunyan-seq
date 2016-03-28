"use strict";

let SeqStream = require('./seq_stream');

module.exports = {
    createStream: config => {
        var stream = new SeqStream(config);
        return {
            name: config.name,
            level: config.level,
            type: 'raw',
            stream: stream
        };
    }
};

'use strict';

let SeqStream = require('./seq_stream');

module.exports = {
  createStream: (config) => {
    config = config || {};
    var stream = new SeqStream(config);
    return {
      name: config.name,
      level: config.level,
      type: 'raw',
      stream: stream,
      reemitErrorEvents: config.reemitErrorEvents
    };
  }
};

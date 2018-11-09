"use strict";

let stream = require("stream");
let seq = require('seq-logging');

let LEVEL_NAMES = {
	10: 'Verbose',
	20: 'Debug',
	30: 'Information',
	40: 'Warning',
	50: 'Error',
	60: 'Fatal'
};

class SeqStream extends stream.Writable {
    constructor(config) {        
        super();
        
        let loggerConfig = config == null ? {} : {...config};
        let onError = loggerConfig.onError || function() {};
        loggerConfig.onError = (e) => {
            this.emit('error', e);
            onError(e);
        };        
        this._logger = new seq.Logger(loggerConfig);

        // At least one listener must be specified, or else the default behavior will
        // be to throw an exception (and halt logging).
        this.on('error', function(){});
    }
    
    write(event) {
        if (!event) {
            this.emit("error", new Error("SeqStream.write() requires an event parameter to be provided."));
            return;
        }
                
        let forSeq = {
            timestamp: event.time,
            level: LEVEL_NAMES[event.level],
            messageTemplate: event.msg,
            properties: event
        }
        
        if (event.err) {
            forSeq.exception = event.err
        }

        this._logger.emit(forSeq);
    }

    // Force the underlying logger to flush at the time of the call
    // and wait for pending writes to complete
    flush() {
        return this._logger.flush();
    }
}

module.exports = SeqStream;

"use strict";

let stream = require('stream');
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
        super({ objectMode: true });
        const onError = (e) => {
            this.destroy(e);
            if (config && typeof config.onError === 'function') {
                config.onError(e);
            }
        };
        this._logger = new seq.Logger({ ...config, onError });
    }

    _write(logEntry, enc, cb) {
        if (logEntry) {
            let { time, level, msg, err, error, stack, v, ...props } = logEntry;

            // Get the properties from the error
            let { message: errMessage, stack: errStack, ...errorProps } = err || error || {};
            const seqEntry = {
                timestamp: new Date(time),
                level: LEVEL_NAMES[level],
                messageTemplate: msg ? msg : errMessage,
                properties: { ...errorProps, ...props },
                exception: stack ? stack : errStack
            };
            try {
                this._logger.emit(seqEntry);
            } catch (err) {
                console.error(err, seqEntry);
            }
        }
        cb();
    }

    // Force the underlying logger to flush at the time of the call
    // and wait for pending writes to complete
    _final(callback) {
        this._logger
            .close()
            .then(() => callback())
            .catch((err) => callback(err));
    }
}

module.exports = SeqStream;

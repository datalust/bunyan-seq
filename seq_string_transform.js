'use strict';

let stream = require('stream');
let seq = require('seq-logging');

let LEVEL_NAMES = {
  Verbose: 10,
  Debug: 20,
  Information: 30,
  Warning: 40,
  Error: 50,
  Fatal: 60
};

/**
 * Forwards ndjson objects as js-objects.
 *
 * Depending on config, other lines will be forwarded or dropped
 */
class SeqStringTransform extends stream.Transform {
  constructor(config) {
    super({
      readableObjectMode: true,
      writableObjectMode: false
    });
    this._logOtherAs = false;
    let { logOtherAs } = config || {};
    if (logOtherAs) {
      if (LEVEL_NAMES[logOtherAs]) {
        this._logOtherAs = LEVEL_NAMES[logOtherAs];
      } else {
        this.destroy(new Error(`${logOtherAs} is not a valid option for "logOtherAs"`));
      }
    }
    this._bufferTime = false;
    this._buffer = [];
  }

  _transform(chunk, encoding, callback) {
    if (chunk) {
      try {
        const message = JSON.parse(chunk);

        // Forward the buffered messages
        if (this._logOtherAs) {
          this.flushBuffer();
        }
        // Just forward the message
        this.push(message);
      } catch (err) {
        if (this._logOtherAs) {
          this.handleUnstructuredMessage(chunk);
        }
      }
    }
    callback(null);
  }

  handleUnstructuredMessage(message) {
    this._bufferTime = this._bufferTime ? this._bufferTime : new Date();
    this._buffer.push(message);
    // Flush the message buffer after 1 sec of inacticity
    if (!this._flushTimer) {
      this._flushTimer = setTimeout(() => {
        this.flushBuffer();
      }, 1000);
    }
  }

  flushBuffer() {
    if (this._buffer.length) {
      // No need to flush again
      if (this._flushTimer) {
        clearTimeout(this._flushTimer);
      }
      if (!this.destroyed) {
        this.push({
          time: this._bufferTime,
          level: this._logOtherAs,
          msg: this._buffer.join('\n')
        });
      }
      this._bufferTime = false;
      this._buffer = [];
    }
  }

  // Force the underlying logger to flush at the time of the call
  // and wait for pending writes to complete
  _flush(callback) {
    this.flushBuffer();
    callback();
  }
}

module.exports = SeqStringTransform;

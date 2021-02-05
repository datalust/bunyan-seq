'use strict';

const assert = require('assert');
const sinon = require('sinon');
let seq = require('seq-logging');
let SeqStream = require('../seq_stream');

describe('SeqStream', () => {
  describe('constructor', () => {
    it('can be constructed', () => {
      new SeqStream();
    });
  });
  describe('object send', () => {
    it('sends an object', () => {
      const time = new Date();
      const logEntry = { time, level: 20, msg: 'test', v: 0, foo: 'bar' };
      const stream = new SeqStream();
      const emitSpy = sinon.spy();
      sinon.replace(stream._logger, 'emit', emitSpy);
      stream.write(logEntry);
      stream.end();

      assert.deepEqual(emitSpy.lastCall.firstArg, {
        timestamp: time,
        level: 'Debug',
        messageTemplate: 'test',
        properties: { foo: 'bar' },
        exception: undefined
      });
    });
    it('sends an trace for err', () => {
      const time = new Date();
      const err = new Error('foo');
      err.stack = 'stack Message';
      err.foo = 'bar';
      const logEntry = { time, level: 50, err };
      const stream = new SeqStream();
      const emitSpy = sinon.spy();
      sinon.replace(stream._logger, 'emit', emitSpy);
      stream.write(logEntry);
      stream.end();

      assert.deepEqual(emitSpy.lastCall.firstArg, {
        timestamp: time,
        level: 'Error',
        messageTemplate: 'foo',
        properties: { foo: 'bar' },
        exception: 'stack Message'
      });
    });
    it('sends an trace for error', () => {
      const time = new Date();
      const err = new Error('foo');
      err.stack = 'stack Message';
      err.foo = 'bar';
      const logEntry = { time, level: 50, err, another: 'prop' };
      const stream = new SeqStream();
      const emitSpy = sinon.spy();
      sinon.replace(stream._logger, 'emit', emitSpy);
      stream.write(logEntry);
      stream.end();

      assert.deepEqual(emitSpy.lastCall.firstArg, {
        timestamp: time,
        level: 'Error',
        messageTemplate: 'foo',
        properties: { foo: 'bar', another: 'prop' },
        exception: 'stack Message'
      });
    });
    it('sends an trace for err, msg overrrides', () => {
      const time = new Date();
      const err = new Error('foo');
      err.stack = 'stack Message';
      err.foo = 'bar';
      const logEntry = { time, level: 50, msg: 'A message!', err };
      const stream = new SeqStream();
      const emitSpy = sinon.spy();
      sinon.replace(stream._logger, 'emit', emitSpy);
      stream.write(logEntry);
      stream.end();

      assert.deepEqual(emitSpy.lastCall.firstArg, {
        timestamp: time,
        level: 'Error',
        messageTemplate: 'A message!',
        properties: { foo: 'bar' },
        exception: 'stack Message'
      });
    });
    it('closes correctly', (done) => {
      const logEntry = { time: new Date(), level: 20, msg: 'test', v: 0, foo: 'bar' };
      const stream = new SeqStream();
      sinon.replace(stream._logger, 'emit', sinon.stub());
      sinon.replace(stream._logger, 'close', sinon.fake.resolves(true));
      stream.write(logEntry);
      stream.end(() => {
        assert.equal(stream._logger.close.callCount, 1);
        done();
      });
    });
  });
});

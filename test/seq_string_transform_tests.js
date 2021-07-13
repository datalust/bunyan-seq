'use strict';

const assert = require('assert');
const SeqStringTransform = require('../seq_string_transform');

describe('SeqStringTransform', () => {
  describe('constructor', () => {
    it('can be constructed', () => {
      new SeqStringTransform();
    });
  });
  describe('object forwards', () => {
    it('transforms json-strings to objects', function (done) {
      const stream = new SeqStringTransform();
      const testObject = { test: 'test' };

      stream.once('data', (data) => {
        try {
          assert.deepEqual(data, testObject);
          done();
        } catch (err) {
          done(err);
        }
      });
      stream.write(JSON.stringify(testObject));
      stream.end();
    });
    it('transforms strings to objects', function (done) {
      const stream = new SeqStringTransform({ logOtherAs: 'Information' });
      const testString = 'This is a test string';

      stream.once('data', (data) => {
        try {
          assert.equal(data.msg, testString);
          assert.equal(data.level, 30);
          assert(data.time instanceof Date, 'Error in with timestamp format');
          done();
        } catch (err) {
          done(err);
        }
      });
      stream.write(testString);
      stream.end();
    });
    it('transforms does not transform', function (done) {
      const stream = new SeqStringTransform();
      const testString = 'This is a test string';
      const testObject = { test: 'test' };

      stream.once('data', (data) => {
        try {
          assert.deepEqual(data, testObject);
          done();
        } catch (err) {
          done(err);
        }
      });
      stream.write(testString);
      stream.write(JSON.stringify(testObject));
      stream.end();
    });
    it('transforms transform after 1 sec', function (done) {
      const stream = new SeqStringTransform({ logOtherAs: 'Information' });
      const testString = 'This is a test string';

      stream.once('data', (data) => {
        try {
          assert.equal(data.msg, testString);
          assert.equal(data.level, 30);
          assert(data.time instanceof Date, 'Error in with timestamp format');
          done();
        } catch (err) {
          done(err);
        }
      });
      stream.write(testString);
    });
  });
});

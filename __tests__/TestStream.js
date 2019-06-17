/* eslint-disable no-underscore-dangle */
const { Duplex } = require('stream');

class TestStream extends Duplex {
  constructor(options) {
    super(options);
    this.data = '';
  }

  _read() {
    this.push(this.data);
  }

  _write(chunk) {
    this.data = chunk;
  }

  cursorTo(cursor) {
    this.cursor = cursor;
  }

  clearLine(dir) {
    if (dir === 1) {
      this.data = this.data.slice(this.cursor);
    }
  }
}

module.exports = TestStream;

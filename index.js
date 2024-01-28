function every (buffer, predicate) {
  if (Uint8Array && Uint8Array.prototype.every) {
    return buffer.every(predicate);
  } else {
    for (let i = 0; i < buffer.length; i++) {
      if (!predicate(buffer[i], i, buffer)) {
        return false;
      }
    }
    return true;
  }
}

/**
 * A simple plugin for Chai that compares byte arrays on per-element basis.
 *
 * @example
 *   expect(new Uint8Array([1, 2])).to.equalBytes([1, 2]);
 *   expect(new Uint8Array[65, 66, 67])).to.equalBytes('414243');
 */
export default function (chai) {
  const Assertion = chai.Assertion;

  Assertion.addMethod('equalBytes', function (expected) {
    if (typeof expected === 'string') {
      if (expected.length % 2 !== 0 || !/^[0-9a-f]*$/i.test(expected)) {
        throw new TypeError('Invalid hex string: ' + expected);
      }
    } else if (expected.length === undefined) {
      throw new TypeError('equalBytes consumes string, array, or array-like object; got none of those');
    }

    const actual = this._obj;
    new Assertion(actual).to.be.a('uint8array');

    let assert;
    if (typeof expected === 'string') {
      // expected value is a hex string
      assert = expected.length === actual.length * 2 &&
        every(actual, (x, i) => {
          return x === parseInt(expected.substring(2 * i, 2 * i + 2), 16);
        });
    } else /* Got an array */ {
      // expected value is an array
      assert = expected.length === actual.length &&
        every(actual, (x, i) => { return expected[i] === x; });
    }

    this.assert(
      assert,
      'expected #{this} to equal #{exp}',
      'expected #{this} to not equal #{exp}',
      expected
    );
  });

  chai.assert.equalBytes = (value, expected, message) => {
    return new Assertion(value, message, chai.assert.equalBytes, true).to.equalBytes(expected);
  };
}

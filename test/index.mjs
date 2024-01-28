/* eslint-env node, mocha */

import * as chai from 'chai';
import chaiBytes from '../index.js';

const { expect, assert } = chai.use(chaiBytes);

describe('chai-bytes', () => {
  it('should fail on Array input', () => {
    const array = [1, 2, 3, 4];
    expect(() => { expect(array).to.equalBytes('01020304'); }).to.throw(chai.AssertionError);
    expect(() => { expect(array).to.not.equalBytes('01020304'); }).to.throw(chai.AssertionError);
  });

  let name;
  const invalidInputs = {
    boolean: true,
    object: {},
    func: () => { },
    undef: undefined,
    number: 123,
    string: 'abcdef'
  };
  for (name in invalidInputs) {
    ((input) => {
      it('should fail on ' + name + ' input', () => {
        expect(() => { expect(input).to.equalBytes(''); }).to.throw(chai.AssertionError);
        expect(() => { expect(input).to.not.equalBytes(''); }).to.throw(chai.AssertionError);
      });
    })(invalidInputs[name]);
  }

  const invalidExpectedValues = {
    boolean: true,
    object: {},
    number: 123
  };
  for (name in invalidExpectedValues) {
    ((expected) => {
      it('should fail on ' + name + ' expected value', () => {
        const input = new Uint8Array([1, 2, 3]);
        expect(() => { expect(input).to.equalBytes(expected); }).to.throw(TypeError, /equalBytes/);
        expect(() => { expect(input).to.not.equalBytes(expected); }).to.throw(TypeError, /equalBytes/);
      });
    })(invalidExpectedValues[name]);
  }

  it('should succeed with expected value stated as string', () => {
    const buffer = new Uint8Array([1, 2, 3, 4]);
    expect(() => { expect(buffer).to.equalBytes('01020304'); }).to.not.throw();
  });

  it('should fail with a different expected value stated as string', () => {
    const buffer = new Uint8Array([1, 2, 3, 4]);
    expect(() => { expect(buffer).to.equalBytes('01020305'); }).to.throw(chai.AssertionError);
  });

  it('should succeed with expected value stated as array', () => {
    const buffer = new Uint8Array([1, 2, 3, 4]);
    expect(() => { expect(buffer).to.equalBytes([1, 2, 3, 4]); }).to.not.throw();
  });

  it('should fail with a different expected value stated as array', () => {
    const buffer = new Uint8Array([1, 2, 3, 256]); // it's equal to [1, 2, 3, 0]
    expect(() => { expect(buffer).to.equalBytes([1, 2, 3, 256]); }).to.throw(chai.AssertionError);
  });

  it('should succeed with expected value stated as Uint8Array', () => {
    const buffer = new Uint8Array([1, 2, 3, 4]);
    const expected = new Uint8Array([1, 2, 3, 4]);
    expect(() => { expect(buffer).to.equalBytes(expected); }).to.not.throw();
  });

  it('should fail with a different expected value stated as Uint8Array', () => {
    const buffer = new Uint8Array([1, 2, 3, 4]);
    const expected = new Uint8Array([1, 2, 2, 4]);
    expect(() => { expect(buffer).to.equalBytes(expected); }).to.throw(chai.AssertionError);
  });

  it('should fail with a short expected value', () => {
    const buffer = new Uint8Array([1, 2, 3, 4]);
    expect(() => { expect(buffer).to.equalBytes('010203'); }).to.throw(chai.AssertionError);
  });

  it('should fail with a long expected value', () => {
    const buffer = new Uint8Array([1, 2, 3, 4]);
    expect(() => { expect(buffer).to.equalBytes('0102030405'); }).to.throw(chai.AssertionError);
  });

  it('should succeed with an empty buffer', () => {
    const buffer = new Uint8Array(0);
    expect(() => { expect(buffer).to.equalBytes(''); }).to.not.throw();
  });

  it('should properly decode hex string', () => {
    const buffer = new Uint8Array([0xab, 0xcd]);
    expect(() => { expect(buffer).to.equalBytes('abcd'); }).to.not.throw();
    expect(() => { expect(buffer).to.equalBytes('AbCd'); }).to.not.throw();
    expect(() => { expect(buffer).to.equalBytes('aBC0'); }).to.throw(chai.AssertionError);
  });

  [
    'abc',
    '?abc',
    'АБЦД',
    'abcd f'
  ].forEach(function (str) {
    it('should throw a TypeError for invalid hex string "' + str + '"', () => {
      const buffer = new Uint8Array([0xab, 0xcd]);
      expect(() => { expect(buffer).to.equalBytes(str); }).to.throw(TypeError, /invalid/i);
    });
  });

  it('should work with preceding negation', () => {
    const buffer = new Uint8Array([0xc0, 0xff, 0xee]);
    expect(() => { expect(buffer).to.not.equalBytes('c0ffee'); }).to.throw(chai.AssertionError);
    expect(() => { expect(buffer).to.not.equalBytes('deadbeef'); }).to.not.throw();
  });

  it('should be chainable', () => {
    const buffer = new Uint8Array([0xc0, 0xff, 0xee]);
    expect(() => {
      expect(buffer).to.equalBytes('c0ffee')
        .and.have.lengthOf(3);
    }).to.not.throw();
    expect(() => {
      expect(buffer).to.equalBytes('c0ffee')
        .and.have.lengthOf(2);
    }).to.throw(chai.AssertionError, /length/i);
  });

  it('should work with `assert`', () => {
    const buffer = new Uint8Array([0xc0, 0xff, 0xee]);
    expect(() => {
      assert.equalBytes(buffer, 'c0ffee');
    }).to.not.throw();

    expect(() => {
      assert.equalBytes(buffer, 'c0ff');
    }).to.throw(chai.AssertionError);
  });

  it('should work with `assert` with custom message', () => {
    const buffer = new Uint8Array([0xc0, 0xff, 0xee]);
    expect(() => {
      assert.equalBytes(buffer, 'c0ff', 'bottom text');
    }).to.throw(chai.AssertionError, 'bottom text');
  });

  describe('when Uint8Array.prototype.every is undefined', () => {
    const uint8ArrayEvery = Uint8Array.prototype.every;

    before(() => {
      // eslint-disable-next-line
      Uint8Array.prototype.every = undefined;
      expect(typeof Uint8Array.prototype.every).to.equal('undefined');
    });

    after(() => {
      // eslint-disable-next-line
      Uint8Array.prototype.every = uint8ArrayEvery;
    });

    it('should fail on non-matching arrays', () => {
      const buffer = new Uint8Array([1, 2, 3, 4]);
      expect(() => { expect(buffer).to.equalBytes('01020504'); }).to.throw(chai.AssertionError);
    });

    it('should succeed with expected value stated as string', () => {
      const buffer = new Uint8Array([1, 2, 3, 4]);
      expect(() => { expect(buffer).to.equalBytes('01020304'); }).to.not.throw();
    });
  });
});

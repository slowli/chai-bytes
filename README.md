# Chai Assertions for Byte Arrays Equality

**chai-bytes** extends [Chai][chai] with a `equalBytes` function,
which can be used to test equality of byte arrays (i.e., `Uint8Array` instances).

## Basic Usage

```javascript
const expect = require('chai')
  .use(require('chai-bytes'))
  .expect();

var buffer = new Uint8Array([ 1, 2, 3, 4, 5 ]);
expect(buffer).to.equalBytes('0102030405');
```

An expected value passed to `equalBytes` can be:

- Hexadecimal string, e.g., `c0ffee`
- Array, e.g., `[1, 2, 3]`
- Array-like object (i.e., an object having the `length` property
  and items accessible by integer properties).
  This includes `Uint8Array` instances

If the passed value does not fall into any of these categories,
a `TypeError` is thrown.

## License

(c) 2017 Alex Ostrovski

**chai-bytes** is available under [Apache-2.0 license](LICENSE).

[chai]: https://chaijs.com/

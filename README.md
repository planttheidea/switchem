# switchem

<img src="https://img.shields.io/badge/build-passing-brightgreen.svg"/>
<img src="https://img.shields.io/badge/coverage-100%25-brightgreen.svg"/>
<img src="https://img.shields.io/badge/license-MIT-blue.svg"/>

An extensible, functional switch with a chainable API

## Table of contents

* [Usage](#usage)
* [switchem API](#switchem-api)
  * [default](#default)
  * [is](#is)
  * [match](#match)
  * [merge](#merge)
  * [not](#not)
* [Options](#options)
  * [runMatchCallback](#runmatchcallback)
* [Additional methods](#additional-methods)
  * [addCustomCase](#addcustomcase)
* [Browser support](#browser-support)
* [Development](#development)

## Usage

```javascript
import switchem, {addCustomCase} from 'switchem';

// create switch statements with the chainable API
const sw1 = switchem()
  .is('foo', 'I am foo')
  .not('bar', 'I am not bar')
  .default('I must be bar!');

console.log(sw1.match('baz')); // I am not bar
console.log(sw1.match('bar')); // I must be bar!

// extend existing switch statements by simply adding to them
const sw2 = sw1.is(value => {
  return value === 'bar';
}, 'I am actually bar');

console.log(sw2.match('baz')); // I am not bar
console.log(sw2.match('bar')); // I am actually bar

// or add commonly-used cases for reuse
addCustomCase('isDivisibleBy', (testValue, matchValue) => {
  return matchValue % testValue === 0;
});

console.log(
  switchem()
    .isDivisibleBy(7, 'divisible by seven')
    .match(49)
); // divisible by seven
```

## switchem API

#### default

_default(defaultValue: any): Switchem_

Set the default value for the switch, which is returned if none of the cases match.

```javascript
const sw = switchem().default('default');
```

#### is

_is(testValue: any, matchResult: ?any = true): Switchem_

Add a case statement that tests for equality with the `matchValue`.

```javascript
const sw = switchem()
  // functions are executed passing the switched value
  .is(value => {
    return value % 2 === 0;
  }, 'I am an even number')
  // regex values are tested via re.test()
  .is(/bar/g, 'I contain bar')
  // NaN value comparisons are supported
  .is(NaN, 'I am a NaN')
  // static values test for strict equality
  .is('foo', 'I am foo');

console.log(sw.match(4)); // I am an even number
console.log(sw.match('bar')); // I contain bar
console.log(sw.match('foo')); // I am foo
```

If you provide a function as a `matchResult`, by default this will be called with both the `testValue` and the
`matchValue`

```javascript
const sw = switchem().is('foo', (testValue, matchValue) => {
  return `${matchValue} match found: ${testValue}`.
});

console.log(sw.match('foo')); // foo match found: foo
```

This setting can be disabled by setting `runMatchCallback` to `false` in `options`.

#### match

_match(matchValue: any): any_

Find the match for `matchValue` based on the existing cases provided in the switch.

```javascript
const sw = switchem().is('foo', 'I am foo');

console.log(sw.match('foo')); // I am foo
```

#### merge

_merge(...switchems: Array<Switchem>): Switchem_

Merge the `switchem` instances passed into a new, combined instance.

```javascript
const original = switchem();
const first = switchem()
  .default('defaultValue')
  .is('first', 'I am first');
const second = switchem({runMatchCallback: false}).is('second', 'I am second');

const merged = original.merge(first, second);

// merged is the same as
// switchem({runMatchCallback: false})
//   .default('defaultValue');
//   .is('first', 'I am first')
//   .is('second', 'I am second')
```

#### not

_not(testValue: any, matchResult: ?any = true): Switchem_

Add a case statement that tests for non-equality with the `matchValue`.

```javascript
const sw = switchem()
  // functions are executed passing the switched value
  .not(value => {
    return value % 2 === 0;
  }, 'I am an odd number')
  // regex values are tested via re.test()
  .not(/bar/g, 'I do not contain bar')
  // static values test for strict equality
  .not('foo', 'I am not foo');

console.log(sw.match(3)); // I am an odd number
console.log(sw.match('bar')); // I am not foo
console.log(sw.match('foo')); // I do not contain bar
```

If you provide a function as a `matchResult`, by default this will be called with both the `testValue` and the
`matchValue`

```javascript
const sw = switchem().not('foo', (testValue, matchValue) => {
  return `${matchValue} non-match found: ${testValue}`.
});

console.log(sw.match('bar')); // bar non-match found: foo
```

This setting can be disabled by setting `runMatchCallback` to `false` in `options`.

## Options

#### runMatchCallback

_boolean, defaults to true_

When this option is `true`, then any functions that are used as `matchResult` values will be executed upon match.

```javascript
const sw = switchem().is('foo', (testValue, matchValue) => {
  return [matchValue, testValue];
});

console.log(sw.match('foo')); // ['foo', 'foo']
```

When set to `false`, the method is returned like standard values.

```javascript
const sw = switchem({runMatchCallback: false}).is('foo', (testValue, matchValue) => {
  return [matchValue, testValue];
});

console.log(sw.match('foo')); // (testValue, matchValue) => { return [matchValue, testValue]; }
```

## Additional methods

#### addCustomCase

_addCustomCase(name: string, method: function, isNot: ?boolean): void_

Adds a custom case method to the `switchem` prototype, which provides convenient reuse of a commonly-applied case.

```javascript
// use existing utility methods
import {contains} from 'ramda';
import {addCustomCase} from 'switchem';

addCustomCase('contains', contains);

const sw1 = switchem().contains('bar', 'I contain bar!');

console.log(sw1.match(['foo', 'bar', 'baz'])); // I contain bar!

// or add your own
addCustomCase(
  'notDivisibleBy',
  (testValue, matchValue) => {
    return matchValue % testValue === 0;
  },
  true
);

const sw2 = switchem().notDivisibleBy(7, 'not divisible by seven');

console.log(s2.match(12)); // not divisible by seven
```

This method will be available for all uses of `switchem` after execution, so it is recommended to run this method as
early in your app initialization as possible.

## Browser support

* Chrome (all versions)
* Firefox (all versions)
* Edge (all versions)
* Opera 15+
* IE 9+
* Safari 6+
* iOS 8+
* Android 4+

## Development

Standard stuff, clone the repo and `npm install` dependencies. The npm scripts available:

* `build` => run webpack to build development `dist` file with NODE_ENV=development
* `build:minified` => run webpack to build production `dist` file with NODE_ENV=production
* `dev` => run webpack dev server to run example app / playground
* `dist` => runs `build` and `build-minified`
* `lint` => run ESLint against all files in the `src` folder
* `prepublish` => runs `compile-for-publish`
* `prepublish:compile` => run `lint`, `test:coverage`, `transpile:es`, `transpile:lib`, `dist`
* `test` => run AVA test functions with `NODE_ENV=test`
* `test:coverage` => run `test` but with `nyc` for coverage checker
* `test:watch` => run `test`, but with persistent watcher
* `transpile:lib` => run babel against all files in `src` to create files in `lib`
* `transpile:es` => run babel against all files in `src` to create files in `es`, preserving ES2015 modules (for
  [`pkg.module`](https://github.com/rollup/rollup/wiki/pkg.module))

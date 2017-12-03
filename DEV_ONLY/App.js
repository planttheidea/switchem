import React, {PureComponent} from 'react';
import {render} from 'react-dom';

import includes from 'lodash/fp/includes';
import {contains} from 'ramda';

import switchem, {addCustomCase} from '../src';

addCustomCase('includes', includes);
addCustomCase('notIncludes', contains, true);

const empty = switchem();

console.log(empty.match('foo'));
console.log(empty.default('default').match('foo'));
console.log(empty.match('foo'));

const sw = switchem()
  .default('nope')
  // .notIncludes('foo', 'does not have the thing')
  .includes('blah', 'has the thing')
  .is(5, 'five')
  .is(
    (value) => {
      return value instanceof Array;
    },
    (...args) => {
      return [`instance of array, via callback`, args];
    }
  )
  .is((value) => {
    return value % 2 === 0;
  }, 'even')
  .is((value) => {
    return value.length;
  }, 'has length')
  .not(/27/g, 'not foo');

const otherSw = switchem()
  .merge(sw)
  .default(null);

console.log(sw);
console.log(otherSw);
console.log(otherSw.match(['blah']));

// const is5 = is(5);
//
// console.group('is 5');
// console.log(5, is5(5));
// console.log(10, is5(10));
// console.groupEnd('is 5');
//
// const isNot5 = not(5);
//
// console.group('is not 5');
// console.log(10, isNot5(10));
// console.log(5, isNot5(5));
// console.groupEnd('is not 5');
//
// const isMultiple5Even = is((value) => {
//   return (value * 5) % 2 === 0;
// });
//
// console.group('is the value passed multiplied by 5 even');
// console.log(10, isMultiple5Even(10));
// console.log(5, isMultiple5Even(5));
// console.groupEnd('is the value passed multiplied by 5 even');
//
// const isMultiple5Odd = not((value) => {
//   return (value * 5) % 2 === 0;
// });
//
// console.group('is the value passed multiplied by 5 odd');
// console.log(5, isMultiple5Odd(5));
// console.log(10, isMultiple5Odd(10));
// console.groupEnd('is the value passed multiplied by 5 odd');
//
// const isFoo = is(/foo/g);
//
// console.group('does the string passed match the foo regexp');
// console.log('some foo', isFoo('some foo'));
// console.log('some bar', isFoo('some bar'));
// console.groupEnd('does the string passed match the foo regexp');
//
// const isNotFoo = not(/foo/g);
//
// console.group('does the string passed not match the foo regexp');
// console.log('some bar', isNotFoo('some bar'));
// console.log('some foo', isNotFoo('some foo'));
// console.groupEnd('does the string passed not match the foo regexp');

class App extends PureComponent {
  element = null;

  render() {
    return <div>App</div>;
  }
}

const renderApp = (container) => {
  render(<App />, container);
};

document.body.style.backgroundColor = '#1d1d1d';
document.body.style.color = '#d5d5d5';
document.body.style.margin = 0;
document.body.style.padding = 0;

const div = document.createElement('div');

renderApp(div);

document.body.appendChild(div);

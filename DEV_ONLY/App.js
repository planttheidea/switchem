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

addCustomCase(
  'notDivisibleBy',
  (testValue, matchValue) => {
    return matchValue % testValue === 0;
  },
  true
);

const swCustom = switchem()
  .notDivisibleBy(7, 'not divisble by seven')
  .default('yup, can divide it by 7');

console.log(swCustom.match(12));
console.log(swCustom.match(49));

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

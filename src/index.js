// switchem class
import {Switchem} from './Switchem';

// utils
import {createCaseCreator} from './utils';

/**
 * @function addCustomCase
 *
 * @description
 * create a new case method on all switchem instances, for reused tests that are function-based
 *
 * @param {string} name the name of the case
 * @param {function} method the method to use as the comparison
 * @param {boolean} [isNot] is the comparison a "not equals" comparison
 */
export const addCustomCase = (name, method, isNot) => {
  if (typeof method !== 'function') {
    throw new TypeError('Case passed must be a function.');
  }

  if (Switchem.prototype[name]) {
    throw new ReferenceError('This case name is already in use.');
  }

  const newCase = createCaseCreator(method, isNot);

  Switchem.prototype[name] = function(testValue, matchResult) {
    return new Switchem(this.options, [...this.cases, newCase(testValue, matchResult)], this.defaultValue);
  };
};

/**
 * @function switchem
 *
 * @description
 * create a new switchem instance
 *
 * @param {Object} options the options to create the instance with
 * @returns {Switchem} the new switchem instance
 */
export default (options) => {
  return new Switchem(options);
};

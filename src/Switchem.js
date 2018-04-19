// utils
import {getMatchingKeyValuePair, is, not} from './utils';

/**
 * @constant {Object} DEFAULT_OPTIONS
 */
export const DEFAULT_OPTIONS = {
  runMatchCallback: true
};

/**
 * @class Switchem
 *
 * @classdesc
 * the functional switch statement that will iterate over the cases and return the value of the one that matches
 */
export class Switchem {
  constructor(options, cases, defaultValue) {
    this.cases = Array.isArray(cases) ? cases : [];
    this.defaultValue = defaultValue;
    this.options = {...DEFAULT_OPTIONS, ...options};

    return this;
  }

  /**
   * @function default
   * @memberof Switchem
   *
   * @description
   * return a new switchem with the default value set to the value passed
   *
   * @param {*} defaultValue the value to return if no cases match
   * @returns {Switchem}
   */
  default(defaultValue) {
    return new Switchem(this.options, this.cases, defaultValue);
  }

  /**
   * @function is
   * @memberof Switchem
   *
   * @description
   * return a new switchem with the new "is equal" case statement added
   *
   * @param {*} testValue the value to test against
   * @param {*} matchResult the value to test (the value passed to the .match() method)
   * @returns {Switchem}
   */
  is(testValue, matchResult) {
    return new Switchem(this.options, [...this.cases, is(testValue, matchResult)], this.defaultValue);
  }

  /**
   * @function match
   * @memberof Switchem
   *
   * @description
   * based on the available cases, returns the resulting match value or the default value
   *
   * @param {*} matchValue the value to test against
   * @returns {Switchem}
   */
  match(matchValue) {
    const match = getMatchingKeyValuePair(this.cases, matchValue, this.defaultValue);

    return this.options.runMatchCallback && typeof match.value === 'function'
      ? match.value(match.key, matchValue)
      : match.value;
  }

  /**
   * @function merge
   * @memberof Switchem
   *
   * @description
   * merge the current switchem instance with all the ones passed
   *
   * @param {...Array<Switchem>} the switchem instances to merge into the new instance
   * @returns {Switchem} the merged switchem instance
   */
  merge(...switchems) {
    return switchems.reduce(
      (mergedSwitchem, switchem) =>
        new Switchem(
          {...mergedSwitchem.options, ...switchem.options},
          [...mergedSwitchem.cases, ...switchem.cases],
          switchem.defaultValue === undefined ? mergedSwitchem.defaultValue : switchem.defaultValue
        ),
      this
    );
  }

  /**
   * @function not
   * @memberof Switchem
   *
   * @description
   * return a new switchem with the new "is not equal" case statement added
   *
   * @param {*} testValue the value to test against
   * @param {*} matchResult the value to test (the value passed to the .match() method)
   * @returns {Switchem}
   */
  not(testValue, matchResult) {
    return new Switchem(this.options, [...this.cases, not(testValue, matchResult)], this.defaultValue);
  }
}

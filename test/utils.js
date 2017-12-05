// test
import test from 'ava';
import sinon from 'sinon';

// src
import * as utils from 'src/utils';

test('if isSameValueZero returns true if values are strictly equal and false if not', (t) => {
  const value = 'foo';
  const equalValue = 'foo';
  const notEqualValue = 'bar';

  t.true(utils.isSameValueZero(value, equalValue));
  t.false(utils.isSameValueZero(value, notEqualValue));
});

test('if isSameValueZero returns true if values are both NaN equal and false if not', (t) => {
  const value = NaN;
  const equalValue = NaN;
  const notEqualValue = 12;

  t.true(utils.isSameValueZero(value, equalValue));
  t.false(utils.isSameValueZero(value, notEqualValue));
});

test('if isEqual will return the result of the call if testValue is a function', (t) => {
  const resultValue = 'resultValue';

  const testValue = sinon.stub().returns(resultValue);
  const matchValue = 'foo';

  const result = utils.isEqual(testValue, matchValue);

  t.true(testValue.calledOnce);
  t.true(testValue.calledWith(matchValue));

  t.is(result, resultValue);
});

test('if isEqual will return the result of the regexp test method if a regexp value', (t) => {
  const testValue = /foo/g;
  const matchValue = 'foo';

  const spy = sinon.spy(testValue, 'test');

  const result = utils.isEqual(testValue, matchValue);

  t.true(spy.calledOnce);
  t.true(spy.calledWith(matchValue));

  t.true(result);
});

test('if isEqual will do a strict equality test if not a function or regexp value', (t) => {
  const testValue = 'foo';
  const matchValue = 'bar';

  const result = utils.isEqual(testValue, matchValue);

  t.false(result);
});

test('if isEqual will do a NaN equivalency test if both values are NaN', (t) => {
  const testValue = NaN;
  const matchValue = NaN;

  const result = utils.isEqual(testValue, matchValue);

  t.true(result);
});

test('if createCase will create a case handler based on being equal where the values are not equal', (t) => {
  const method = (testValue, matchValue) => {
    return testValue === matchValue;
  };
  const isNot = false;

  const createCase = utils.createCaseCreator(method, isNot);

  const testValue = 'testValue';
  const matchResult = undefined;

  const result = createCase(testValue, matchResult);

  t.is(typeof result, 'object');

  t.is(result.key, testValue);
  t.is(typeof result.test, 'function');

  const matchValue = 'matchValue';

  t.is(result.test(matchValue), utils.NO_MATCH_FOUND);
});

test('if createCase will create a case handler based on being equal where the values are equal', (t) => {
  const method = (testValue, matchValue) => {
    return testValue === matchValue;
  };
  const isNot = false;

  const createCase = utils.createCaseCreator(method, isNot);

  const testValue = 'testValue';
  const matchResult = undefined;

  const result = createCase(testValue, matchResult);

  t.is(typeof result, 'object');

  t.is(result.key, testValue);
  t.is(typeof result.test, 'function');

  const matchValue = testValue;

  t.is(result.test(matchValue), true);
});

test('if createCase will create a case handler based on being equal where the values are equal with a custom matchResult', (t) => {
  const method = (testValue, matchValue) => {
    return testValue === matchValue;
  };
  const isNot = false;

  const createCase = utils.createCaseCreator(method, isNot);

  const testValue = 'testValue';
  const matchResult = 'matchResult';

  const result = createCase(testValue, matchResult);

  t.is(typeof result, 'object');

  t.is(result.key, testValue);
  t.is(typeof result.test, 'function');

  const matchValue = testValue;

  t.is(result.test(matchValue), matchResult);
});

test('if createCase will create a case handler based on being not equal where the values are equal', (t) => {
  const method = (testValue, matchValue) => {
    return testValue === matchValue;
  };
  const isNot = true;

  const createCase = utils.createCaseCreator(method, isNot);

  const testValue = 'testValue';
  const matchResult = undefined;

  const result = createCase(testValue, matchResult);

  t.is(typeof result, 'object');

  t.is(result.key, testValue);
  t.is(typeof result.test, 'function');

  const matchValue = testValue;

  t.is(result.test(matchValue), utils.NO_MATCH_FOUND);
});

test('if createCase will create a case handler based on being not equal where the values are not equal', (t) => {
  const method = (testValue, matchValue) => {
    return testValue === matchValue;
  };
  const isNot = true;

  const createCase = utils.createCaseCreator(method, isNot);

  const testValue = 'testValue';
  const matchResult = undefined;

  const result = createCase(testValue, matchResult);

  t.is(typeof result, 'object');

  t.is(result.key, testValue);
  t.is(typeof result.test, 'function');

  const matchValue = 'matchValue';

  t.is(result.test(matchValue), true);
});

test('if createCase will create a case handler based on being not equal where the values are not equal with a custom matchResult', (t) => {
  const method = (testValue, matchValue) => {
    return testValue === matchValue;
  };
  const isNot = true;

  const createCase = utils.createCaseCreator(method, isNot);

  const testValue = 'testValue';
  const matchResult = 'matchResult';

  const result = createCase(testValue, matchResult);

  t.is(typeof result, 'object');

  t.is(result.key, testValue);
  t.is(typeof result.test, 'function');

  const matchValue = 'matchValue';

  t.is(result.test(matchValue), matchResult);
});

test('if getMatchingKeyValuePair will find the matching value if it exists in the list of cases', (t) => {
  const resultValue = 'resultValue';

  const cases = [
    {
      key: 'key',
      test() {
        return utils.NO_MATCH_FOUND;
      }
    },
    {
      key: 'key',
      test: sinon.stub().returns(resultValue)
    }
  ];
  const testValue = 'testValue';
  const defaultValue = 'defaultValue';

  const result = utils.getMatchingKeyValuePair(cases, testValue, defaultValue);

  t.true(cases[1].test.calledOnce);
  t.true(cases[1].test.calledWith(testValue));

  t.deepEqual(result, {
    key: cases[1].key,
    value: resultValue
  });
});

test('if getMatchingKeyValuePair will return the defaultValue if no matches are found', (t) => {
  const cases = [];
  const testValue = 'testValue';
  const defaultValue = 'defaultValue';

  const result = utils.getMatchingKeyValuePair(cases, testValue, defaultValue);

  t.deepEqual(result, {
    key: 'default',
    value: defaultValue
  });
});

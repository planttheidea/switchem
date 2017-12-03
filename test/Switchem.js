// test
import test from 'ava';
import sinon from 'sinon';

// src
import * as switchem from 'src/Switchem';
import * as utils from 'src/utils';

const Switchem = switchem.Switchem;

test('if a new switchem will be created with the correct assigned values', (t) => {
  const options = {foo: 'bar'};
  const cases = [];
  const defaultValue = 'defaultValue';

  const result = new Switchem(options, cases, defaultValue);

  t.is(result.cases, cases);
  t.is(result.defaultValue, defaultValue);
  t.deepEqual(result.options, {
    ...switchem.DEFAULT_OPTIONS,
    ...options
  });
});

test('if a new switchem will be created with the correct coalesced values', (t) => {
  const options = undefined;
  const cases = undefined;
  const defaultValue = undefined;

  const result = new Switchem(options, cases, defaultValue);

  t.deepEqual(result.cases, []);
  t.is(result.defaultValue, undefined);
  t.deepEqual(result.options, switchem.DEFAULT_OPTIONS);
});

test('if default will create a new switchem with the defaultValue assigned', (t) => {
  const defaultValue = 'defaultValue';

  const originalInstance = new Switchem();
  const newInstance = originalInstance.default(defaultValue);

  t.not(originalInstance, newInstance);
  t.not(originalInstance.defaultValue, defaultValue);
  t.is(newInstance.defaultValue, defaultValue);
});

test('if is will create a new switchem with the equals case assigned', (t) => {
  const testValue = 'testValue';
  const matchResult = 'matchResult';

  const fakeCase = {
    key: 'key',
    test: 'test'
  };

  const stub = sinon.stub(utils, 'is').returns(fakeCase);

  const originalInstance = new Switchem();
  const newInstance = originalInstance.is(testValue, matchResult);

  t.true(stub.calledOnce);
  t.true(stub.calledWith(testValue, matchResult));

  stub.restore();

  t.not(originalInstance, newInstance);
  t.notDeepEqual(originalInstance.cases, newInstance.cases);
  t.deepEqual(newInstance.cases, [fakeCase]);
});

test('if match will call getMatchingKeyValuePair and run the value method if it is a function and the option is true', (t) => {
  const instance = new Switchem({runMatchCallback: true}, [], 'defaultValue');

  const resultValue = 'resultValue';

  const keyValuePair = {
    key: 'key',
    value: sinon.stub().returns(resultValue)
  };

  const stub = sinon.stub(utils, 'getMatchingKeyValuePair').returns(keyValuePair);

  const testValue = 'testValue';

  const result = instance.match(testValue);

  t.true(stub.calledOnce);
  t.true(stub.calledWith(instance.cases, testValue, instance.defaultValue));

  stub.restore();

  t.true(keyValuePair.value.calledOnce);
  t.true(keyValuePair.value.calledWith(keyValuePair.key, testValue));

  t.is(result, resultValue);
});

test('if match will call getMatchingKeyValuePair and not run the value method if it is a function but the option is false', (t) => {
  const instance = new Switchem({runMatchCallback: false}, [], 'defaultValue');

  const resultValue = 'resultValue';

  const keyValuePair = {
    key: 'key',
    value: sinon.stub().returns(resultValue)
  };

  const stub = sinon.stub(utils, 'getMatchingKeyValuePair').returns(keyValuePair);

  const testValue = 'testValue';

  const result = instance.match(testValue);

  t.true(stub.calledOnce);
  t.true(stub.calledWith(instance.cases, testValue, instance.defaultValue));

  stub.restore();

  t.true(keyValuePair.value.notCalled);

  t.is(result, keyValuePair.value);
});

test('if match will call getMatchingKeyValuePair and not run the value method if it is not a function', (t) => {
  const instance = new Switchem({runMatchCallback: false}, [], 'defaultValue');

  const keyValuePair = {
    key: 'key',
    value: 'value'
  };

  const stub = sinon.stub(utils, 'getMatchingKeyValuePair').returns(keyValuePair);

  const testValue = 'testValue';

  const result = instance.match(testValue);

  t.true(stub.calledOnce);
  t.true(stub.calledWith(instance.cases, testValue, instance.defaultValue));

  stub.restore();

  t.is(result, keyValuePair.value);
});

test('if merge will combine the switchem instances passed into a new instance', (t) => {
  const originalInstance = new Switchem();
  const firstInstance = new Switchem(
    {},
    [
      {
        key: 'firstKey',
        test() {
          return true;
        }
      }
    ],
    'defaultValue'
  );
  const secondInstance = new Switchem({runMatchCallback: false}, [
    {
      key: 'secondKey',
      test() {
        return false;
      }
    }
  ]);

  const result = originalInstance.merge(firstInstance, secondInstance);

  t.not(result, originalInstance);
  t.not(result, firstInstance);
  t.not(result, secondInstance);

  t.deepEqual(result.options, {
    ...originalInstance.options,
    ...firstInstance.options,
    ...secondInstance.options
  });
  t.deepEqual(result.cases, [...originalInstance.cases, ...firstInstance.cases, ...secondInstance.cases]);
  t.deepEqual(result.defaultValue, firstInstance.defaultValue);
});

test('if not will create a new switchem with the not equals case assigned', (t) => {
  const testValue = 'testValue';
  const matchResult = 'matchResult';

  const fakeCase = {
    key: 'key',
    test: 'test'
  };

  const stub = sinon.stub(utils, 'not').returns(fakeCase);

  const originalInstance = new Switchem();
  const newInstance = originalInstance.not(testValue, matchResult);

  t.true(stub.calledOnce);
  t.true(stub.calledWith(testValue, matchResult));

  stub.restore();

  t.not(originalInstance, newInstance);
  t.notDeepEqual(originalInstance.cases, newInstance.cases);
  t.deepEqual(newInstance.cases, [fakeCase]);
});

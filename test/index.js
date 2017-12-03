// test
import test from 'ava';
import sinon from 'sinon';

// src
import * as index from 'src/index';
import {Switchem, DEFAULT_OPTIONS} from 'src/Switchem';
import * as utils from 'src/utils';

test('if addCustomCase will throw an error when the method passed is not a function', (t) => {
  const name = 'name';
  const method = 'method';
  const isNot = false;

  t.throws(() => {
    index.addCustomCase(name, method, isNot);
  }, TypeError);
});

test('if addCustomCase will throw an error when the method name passed already exists on the prototype', (t) => {
  const name = 'is';
  const method = () => {};
  const isNot = false;

  t.throws(() => {
    index.addCustomCase(name, method, isNot);
  }, ReferenceError);
});

test('if addCustomCase will add a new method to the prototype that executes the method passed', (t) => {
  const fakeCase = {
    key: 'key',
    value: 'value'
  };

  const name = 'name';
  const method = sinon.stub().returns(fakeCase);
  const isNot = false;

  const stub = sinon.stub(utils, 'createCaseCreator').returnsArg(0);

  t.is(typeof Switchem.prototype[name], 'undefined');

  index.addCustomCase(name, method, isNot);

  t.true(stub.calledOnce);
  t.true(stub.calledWith(method, isNot));

  stub.restore();

  t.is(typeof Switchem.prototype[name], 'function');

  const testValue = 'testValue';
  const matchResult = 'matchResult';

  const dummyInstance = new Switchem();

  const result = Switchem.prototype[name].call(dummyInstance, testValue, matchResult);

  t.true(method.calledOnce);
  t.true(method.calledWith(testValue, matchResult));

  t.deepEqual(
    {...result},
    {
      cases: [fakeCase],
      defaultValue: undefined,
      options: DEFAULT_OPTIONS
    }
  );
});

test('if switchem will return a new switchem instance with the options passed', (t) => {
  const options = {foo: 'bar'};

  const result = index.default(options);

  t.true(result instanceof Switchem);
  t.deepEqual(result, new Switchem(options));
});

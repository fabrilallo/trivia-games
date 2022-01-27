
import { test } from 'tap';
import Fastify from 'fastify';
import quizValidator from '../../../lib/quiz/plugins/quizValidator.js';
test('getDuplicatedItems()', async (t) => {
  const fastify = Fastify();
  fastify.register(quizValidator);

  await fastify.ready();
  t.plan(7);

  t.test('should return correct duplicated items', (t) => {
    const array = [
      { name: 'a' },
      { name: 'b' },
      { name: 'c' },
      { name: 'a' }

    ];
    t.same(fastify.getDuplicatedItems(array), ['a']);
    t.end();
  });

  t.test('should return an empty array when there are no duplicated items', (t) => {
    const array = [
      { name: 'a' },
      { name: 'b' },
      { name: 'c' },
      { name: 'd' }

    ];

    t.same(fastify.getDuplicatedItems(array), []);
    t.end();
  });

  t.test('should return an empty array when there is only one element', (t) => {
    const array = [
      { name: 'a' }
    ];

    t.same(fastify.getDuplicatedItems(array), []);
    t.end();
  });

  t.test('should return duplicated item just once even if they are repeated more than twice', (t) => {
    const array = [
      { name: 'a' },
      { name: 'a' },
      { name: 'a' }
    ];

    t.same(fastify.getDuplicatedItems(array), ['a']);
    t.end();
  });

  t.test('should return an empty array when the function recieves null', (t) => {
    const array = null;

    t.throws(() => fastify.getDuplicatedItems(array), 'Array fields must contains at least one element');
    t.end();
  });

  t.test('should return an empty array when the function recieves undefined', (t) => {
    const array = undefined;

    t.throws(() => fastify.getDuplicatedItems(array), 'Array fields must contains at least one element');
    t.end();
  });

  t.test('should return an empty array when the function recieves an input that is not an array', (t) => {
    const array = 'a';

    t.throws(() => fastify.getDuplicatedItems(array), 'Array fields must contains at least one element');
    t.end();
  });
});

test('isCorrectValueUnique()', async (t) => {
  const fastify = Fastify();
  fastify.register(quizValidator);

  await fastify.ready();
  t.plan(5);

  t.test('should return true whern there is only one isCorrect=true', (t) => {
    const array = [
      { isCorrect: true },
      { isCorrect: false },
      { isCorrect: false },
      { isCorrect: false }
    ];
    t.same(fastify.isCorrectValueUnique(array), true);
    t.end();
  });

  t.test('should return false whern there is more than one isCorrect=true', (t) => {
    const array = [
      { isCorrect: true },
      { isCorrect: true },
      { isCorrect: false },
      { isCorrect: false }
    ];
    t.same(fastify.isCorrectValueUnique(array), false);
    t.end();
  });

  t.test('should return an empty array when the function recieves null', (t) => {
    const array = null;

    t.throws(() => fastify.isCorrectValueUnique(array), 'Array fields must contains at least one element');
    t.end();
  });

  t.test('should return an empty array when the function recieves undefined', (t) => {
    const array = undefined;

    t.throws(() => fastify.isCorrectValueUnique(array), 'Array fields must contains at least one element');
    t.end();
  });

  t.test('should return an empty array when the function recieves an input that is not an array', (t) => {
    const array = 'a';

    t.throws(() => fastify.isCorrectValueUnique(array), 'Array fields must contains at least one element');
    t.end();
  });
});

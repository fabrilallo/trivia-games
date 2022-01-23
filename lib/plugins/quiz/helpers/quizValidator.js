
import fp from 'fastify-plugin';

async function quizValidator (fastify, opts) {
  fastify.decorate('getDuplicatedItems', getDuplicatedItems);
  fastify.decorate('isCorrectValueUnique', isCorrectValueUnique);

  function isCorrectValueUnique (answers) {
    if (answers != undefined && answers.length > 0 && Array.isArray(answers)) { // eslint-disable-line eqeqeq
      const filteredAnswers = answers.filter((answer) => answer.isCorrect === true);

      return filteredAnswers.length === 1;
    }
    throw new Error('Array fields must contains at least one element');
  }

  function getDuplicatedItems (array) {
    if (array != undefined && array.length > 0 && Array.isArray(array)) { // eslint-disable-line eqeqeq
      const names = array.map((question) => question.name);

      return [...new Set(names.filter((s => v => s.has(v) || !s.add(v))(new Set())))];
    }

    throw new Error('Array fields must contains at least one element');
  }
}

export default fp(quizValidator, {
  name: 'quizValidator'
})
;

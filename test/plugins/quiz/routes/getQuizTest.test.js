
import { test } from 'tap';
import { build } from '../../../helper.js';

test('GET /quizzes route', async (t) => {
  const app = await build(t);
  t.test('should return all the quizzes', async (t) => {
    const body = {
      id: 1,
      name: 'test-quiz',
      questions: [{
        name: "What's your name?",
        answers: [
          {
            name: 'Fabrizio',
            isCorrect: true
          },
          {
            name: 'Giovanni',
            isCorrect: false
          },
          {
            name: 'Marco',
            isCorrect: false
          },
          {
            name: 'Luca',
            isCorrect: false
          }
        ]
      }]
    };
    const response = await app.inject({
      method: 'GET',
      url: '/quizzes',
      body
    });

    const parsedResponse = response.json();
    t.same(parsedResponse.data, body);
    t.equal(parsedResponse.statusCode, 200);
  });
});

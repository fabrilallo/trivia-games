
import { test } from 'tap';
import { build } from '../helper.js';

test('GET /quizzes route', async (t) => {
  t.plan(2);
  t.test('should return all the quizzes', async (t) => {
    const responseBody = [{
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
    }];
    const app = await build(t, {
      quiz: {
        findMany: () => { return responseBody; }
      }
    });
    const response = await app.inject({
      method: 'GET',
      url: '/quizzes'
    });

    const parsedResponse = response.json();
    t.same(parsedResponse.data, responseBody);
    t.equal(parsedResponse.statusCode, 200);
    t.equal(parsedResponse.message, 'Quizzes retrieved successfully');
  });

  t.test('should return all the quizzes', async (t) => {
    const app = await build(t, {
      quiz: {
        findMany: () => []
      }
    });
    const response = await app.inject({
      method: 'GET',
      url: '/quizzes'

    });

    const parsedResponse = response.json();
    t.same(parsedResponse.data, []);
    t.equal(parsedResponse.statusCode, 200);
    t.equal(parsedResponse.message, 'No quiz present');
  });
});

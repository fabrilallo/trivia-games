
import { test } from 'tap';
import { build } from '../helper.js';

test('DELETE /quizzes/:id route', async (t) => {
  t.plan(1);

  const responseBody = {
    name: 'Guess my name',
    questions: [
      {
        id: 43,
        name: "What's your name?",
        answers: [
          {
            id: 163,
            name: 'Fabrizio',
            isCorrect: true
          },
          {
            id: 164,
            name: 'Giovanni',
            isCorrect: false
          },
          {
            id: 165,
            name: 'Marco',
            isCorrect: false
          },
          {
            id: 166,
            name: 'Luca',
            isCorrect: false
          }
        ]
      }
    ]
  };

  t.test('should return the quiz deleted', async (t) => {
    const app = await build(t, {
      quiz: {
        delete: () => responseBody
      }
    });
    const response = await app.inject({
      method: 'DELETE',
      url: '/quizzes/1'
    });

    const parsedResponse = response.json();
    t.equal(parsedResponse.message, 'Quiz 1 deleted successfully');
    t.same(parsedResponse.data, responseBody);
    t.equal(parsedResponse.statusCode, 200);
  });
});

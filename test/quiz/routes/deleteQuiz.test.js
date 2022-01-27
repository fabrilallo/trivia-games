
import { test } from 'tap';
import { buildQuizPlugin } from '../../helper.js';

test('DELETE /quizzes/:id route', async (t) => {
  const user = {
    email: 'fabrizio.lallo95@gmail.com',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjQzMjI2MTgxLCJleHAiOjE2NDM0ODUzODF9.qDxE0OObUWXlSTTYWP19rBT8XJOcfUJhA4OHgxTvXYQ',
    createdAt: '2022-01-26T19:43:01.743Z',
    updatedAt: '2022-01-26T19:43:01.747Z'
  };

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
    const app = await buildQuizPlugin(t, {
      quiz: {
        delete: () => responseBody,
        findMany: () => [responseBody]

      },
      user: {
        findMany: () => [user]
      }
    });
    const response = await app.inject({
      method: 'DELETE',
      url: '/quizzes/1',
      headers: {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjQzMjI2MTgxLCJleHAiOjE2NDM0ODUzODF9.qDxE0OObUWXlSTTYWP19rBT8XJOcfUJhA4OHgxTvXYQ'
      }
    });

    const parsedResponse = response.json();
    t.equal(parsedResponse.message, 'Quiz 1 deleted successfully');
    t.same(parsedResponse.data, responseBody);
    t.equal(parsedResponse.statusCode, 200);
  });
});

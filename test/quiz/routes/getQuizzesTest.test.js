
import { test } from 'tap';
import { buildQuizPlugin } from '../../helper.js';

test('GET /quizzes route', async (t) => {
  const user = {
    email: 'fabrizio.lallo95@gmail.com',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjQzMjI2MTgxLCJleHAiOjE2NDM0ODUzODF9.qDxE0OObUWXlSTTYWP19rBT8XJOcfUJhA4OHgxTvXYQ',
    createdAt: '2022-01-26T19:43:01.743Z',
    updatedAt: '2022-01-26T19:43:01.747Z'
  };
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
    const app = await buildQuizPlugin(t, {
      quiz: {
        findMany: () => { return responseBody; }
      },
      user: {
        findMany: () => [user]
      }
    });
    const response = await app.inject({
      method: 'GET',
      url: '/quizzes',
      headers: {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjQzMjI2MTgxLCJleHAiOjE2NDM0ODUzODF9.qDxE0OObUWXlSTTYWP19rBT8XJOcfUJhA4OHgxTvXYQ'
      }
    });

    const parsedResponse = response.json();
    t.same(parsedResponse.data, responseBody);
    t.equal(parsedResponse.statusCode, 200);
    t.equal(parsedResponse.message, 'Quizzes retrieved successfully');
  });

  t.test('should return all the quizzes', async (t) => {
    const app = await buildQuizPlugin(t, {
      quiz: {
        findMany: () => []
      },
      user: {
        findMany: () => [user]
      }
    });
    const response = await app.inject({
      method: 'GET',
      url: '/quizzes',
      headers: {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjQzMjI2MTgxLCJleHAiOjE2NDM0ODUzODF9.qDxE0OObUWXlSTTYWP19rBT8XJOcfUJhA4OHgxTvXYQ'
      }

    });

    const parsedResponse = response.json();
    t.same(parsedResponse.data, []);
    t.equal(parsedResponse.statusCode, 200);
    t.equal(parsedResponse.message, 'No quiz present');
  });
});

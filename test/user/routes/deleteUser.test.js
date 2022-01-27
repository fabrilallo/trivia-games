
import { test } from 'tap';
import { buildUserPlugin } from '../../helper.js';

test('DELETE /users/:id route', async (t) => {
  const user = {
    email: 'fabrizio.lallo95@gmail.com',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjQzMjI2MTgxLCJleHAiOjE2NDM0ODUzODF9.qDxE0OObUWXlSTTYWP19rBT8XJOcfUJhA4OHgxTvXYQ',
    createdAt: '2022-01-26T19:43:01.743Z',
    updatedAt: '2022-01-26T19:43:01.747Z'
  };

  t.plan(1);
  t.test('should delete the user and return 200', async (t) => {
    const responseBody = {
      email: 'user@gmail.com'
    };

    const app = await buildUserPlugin(t, {
      user: {
        delete: () => responseBody,
        findMany: () => [user]
      }
    });
    const response = await app.inject({
      method: 'DELETE',
      url: '/users/1',
      headers: {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjQzMjI2MTgxLCJleHAiOjE2NDM0ODUzODF9.qDxE0OObUWXlSTTYWP19rBT8XJOcfUJhA4OHgxTvXYQ'
      }
    });

    const parsedResponse = response.json();
    t.same(parsedResponse.data, responseBody);
    t.equal(parsedResponse.statusCode, 200);
  });
});

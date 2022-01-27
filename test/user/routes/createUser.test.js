
import { test } from 'tap';
import { buildUserPlugin } from '../../helper.js';

test('POST /users route', async (t) => {
  const user = {
    email: 'fabrizio.lallo95@gmail.com',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjQzMjI2MTgxLCJleHAiOjE2NDM0ODUzODF9.qDxE0OObUWXlSTTYWP19rBT8XJOcfUJhA4OHgxTvXYQ',
    createdAt: '2022-01-26T19:43:01.743Z',
    updatedAt: '2022-01-26T19:43:01.747Z'
  };
  t.plan(3);
  t.test('should create the user and return 201', async (t) => {
    const body = {
      email: 'user@gmail.com',
      password: 'password1234'
    };

    const responseBody = {
      email: 'user@gmail.com',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjQzMTUzODEyLCJleHAiOjE2NDMxNTM4NzJ9.NsCzstH5vaC8jOhw7mLur4GEw7L2olwWEFGda5wR-kY',
      createdAt: '2022-01-25T23:36:52.423Z',
      updatedAt: '2022-01-26T10:52:05.323Z'
    };

    const app = await buildUserPlugin(t, {
      user: {
        update: () => responseBody,
        create: () => { return { id: 1, ...responseBody }; },
        findMany: () => [user]
      }
    });
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      body,
      headers: {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjQzMjI2MTgxLCJleHAiOjE2NDM0ODUzODF9.qDxE0OObUWXlSTTYWP19rBT8XJOcfUJhA4OHgxTvXYQ'
      }
    });

    const parsedResponse = response.json();
    t.same(parsedResponse.data, responseBody);
    t.equal(parsedResponse.statusCode, 201);
  });

  t.test('should not create the user because password is missing in the body', async (t) => {
    const body = {
      email: 'user@gmail.com'
    };

    const app = await buildUserPlugin(t, {
      user: {
        findMany: () => [user]
      }
    });

    const response = await app.inject({
      method: 'POST',
      url: '/users',
      body,
      headers: {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjQzMjI2MTgxLCJleHAiOjE2NDM0ODUzODF9.qDxE0OObUWXlSTTYWP19rBT8XJOcfUJhA4OHgxTvXYQ'
      }
    });

    const parsedResponse = response.json();
    t.same(parsedResponse.message, "body should have required property 'password'");
    t.equal(parsedResponse.statusCode, 400);
  });

  t.test('should not create the user because email is missing in the body', async (t) => {
    const body = {
      password: 'password1234'
    };

    const app = await buildUserPlugin(t, {
      user: {
        findMany: () => [user]
      }
    });

    const response = await app.inject({
      method: 'POST',
      url: '/users',
      body,
      headers: {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjQzMjI2MTgxLCJleHAiOjE2NDM0ODUzODF9.qDxE0OObUWXlSTTYWP19rBT8XJOcfUJhA4OHgxTvXYQ'
      }
    });

    const parsedResponse = response.json();
    t.same(parsedResponse.message, "body should have required property 'email'");
    t.equal(parsedResponse.statusCode, 400);
  });
});

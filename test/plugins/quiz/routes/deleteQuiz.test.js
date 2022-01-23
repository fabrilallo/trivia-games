
import { test } from 'tap';
import { build } from '../../../helper.js';

test('DELETE /quizzes/:id route', async (t) => {
  const app = await build(t);
  t.test('should return the quiz deleted', async (t) => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/quizzes/1'
    });

    const parsedResponse = response.json();
    t.equal(parsedResponse.message, 'Quiz 1 deleted successfully');
    t.equal(parsedResponse.statusCode, 200);
  });
});

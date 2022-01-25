
import { test } from 'tap';
import { build } from '../helper.js';

test('PUT /quizzes/:id route', async (t) => {
  t.plan(10);

  t.test('should update the quiz and return 200', async (t) => {
    const body = {
      name: 'Guess my name',
      questions: [
        {
          id: 1,
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
    const app = await build(t, {
      quiz: {
        findUnique: () => body,
        update: () => {}
      }
    });
    const response = await app.inject({
      method: 'PUT',
      url: '/quizzes/1',
      body
    });

    const parsedResponse = response.json();
    t.same(parsedResponse.data, body);
    t.equal(parsedResponse.statusCode, 200);
  });

  t.test('should update the quiz name', async (t) => {
    const responseBody = {
      name: 'Guess my name!!!',
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
    const body = {
      name: 'Guess my name!!!'
    };

    const app = await build(t, {
      quiz: {
        update: () => responseBody
      }
    });
    const response = await app.inject({
      method: 'PUT',
      url: '/quizzes/1',
      body
    });

    const parsedResponse = response.json();
    t.equal(parsedResponse.message, 'Quiz 1 updated successfully');
    t.equal(parsedResponse.data.name, responseBody.name);
    t.equal(parsedResponse.statusCode, 200);
  });

  t.test('should update the questions', async (t) => {
    const app = await build(t, {
      quiz: {
        findUnique: () => body,
        update: () => {}
      }
    });
    const body = {
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

    const responseBody = {
      name: 'Guess my name!!!',
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
    const response = await app.inject({
      method: 'PUT',
      url: '/quizzes/1',
      body
    });

    const parsedResponse = response.json();
    t.equal(parsedResponse.message, 'Quiz 1 updated successfully');
    t.same(parsedResponse.data.questions, responseBody.questions);
    t.equal(parsedResponse.statusCode, 200);
  });

  t.test('should return a bad request error because body is empty', async (t) => {
    const app = await build(t);

    const body = {
    };

    const response = await app.inject({
      method: 'PUT',
      url: '/quizzes/1',
      body
    });

    const parsedResponse = response.json();
    t.equal(parsedResponse.message,
      "body should have required property 'name', body should have required property 'questions', body should have required property 'name', body should match some schema in anyOf");
    t.equal(parsedResponse.statusCode, 400);
  });

  t.test('should return a bad request error because questions must be an array', async (t) => {
    const app = await build(t);

    const body = {
      name: 'Guess my name',
      questions: {}
    };
    const response = await app.inject({
      method: 'PUT',
      url: '/quizzes/1',
      body
    });

    const parsedResponse = response.json();
    t.equal(parsedResponse.message, "body.questions should be array, body.questions should be array, body should have required property 'name', body should match some schema in anyOf");
    t.equal(parsedResponse.statusCode, 400);
  });

  t.test('should return a bad request error because questions array must have at least one element', async (t) => {
    const app = await build(t);

    const body = {
      name: 'Guess my name',
      questions: []
    };
    const response = await app.inject({
      method: 'PUT',
      url: '/quizzes/1',
      body
    });

    const parsedResponse = response.json();
    t.equal(parsedResponse.message, "body.questions should NOT have fewer than 1 items, body.questions should NOT have fewer than 1 items, body should have required property 'name', body should match some schema in anyOf");
    t.equal(parsedResponse.statusCode, 400);
  });

  t.test('should return a bad request error because answers array must have 4 elements', async (t) => {
    const app = await build(t);

    const body = {
      name: 'Guess my name',
      questions: [
        {
          id: 1,
          name: "What's your name?",
          answers: [
            {
              id: 163,
              name: 'Fabrizio',
              isCorrect: true
            }
          ]
        }
      ]
    };

    const response = await app.inject({
      method: 'PUT',
      url: '/quizzes/1',
      body
    });

    const parsedResponse = response.json();
    t.equal(parsedResponse.message, "body.questions[0].answers should NOT have fewer than 4 items, body.questions[0].answers should NOT have fewer than 4 items, body should have required property 'name', body should match some schema in anyOf");
    t.equal(parsedResponse.statusCode, 400);
  });

  t.test('should return a bad request error because there are duplicated questions', async (t) => {
    const app = await build(t);

    const body = {
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
        },
        {
          id: 43,
          name: "What's your name?",
          answers: [
            {
              id: 163,
              name: 'Matteo',
              isCorrect: true
            },
            {
              id: 164,
              name: 'Gianluca',
              isCorrect: false
            },
            {
              id: 165,
              name: 'Rocco',
              isCorrect: false
            },
            {
              id: 166,
              name: 'Simone',
              isCorrect: false
            }
          ]
        }
      ]
    };

    const response = await app.inject({
      method: 'PUT',
      url: '/quizzes/1',
      body
    });

    const parsedResponse = response.json();
    t.equal(parsedResponse.message, "The following questions are duplicated: 'What's your name?'");
    t.equal(parsedResponse.statusCode, 400);
  });

  t.test('should return a bad request error because there is more than one correct answer', async (t) => {
    const app = await build(t);

    const body = {
      name: 'Guess my name!!!',
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
              isCorrect: true
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

    const response = await app.inject({
      method: 'PUT',
      url: '/quizzes/1',
      body
    });

    const parsedResponse = response.json();
    t.equal(parsedResponse.message, "The following questions have more than one correct answer: 'What's your name?'");
    t.equal(parsedResponse.statusCode, 400);
  });

  t.test('should return a bad request error because there are 2 answer with same name and different isCorrect values', async (t) => {
    const app = await build(t);

    const body = {
      name: 'Guess my name!!!',
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
              name: 'Fabrizio',
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

    const response = await app.inject({
      method: 'PUT',
      url: '/quizzes/1',
      body
    });

    const parsedResponse = response.json();
    t.equal(parsedResponse.message, "The following questions have same answers with different 'isCorrect' values: 'Fabrizio'");
    t.equal(parsedResponse.statusCode, 400);
  });
});

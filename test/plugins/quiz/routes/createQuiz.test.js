
import { test } from 'tap';
import { build } from '../../../helper.js';

test('POST /quizzes route', async (t) => {
  const app = await build(t);

  t.test('should create the quiz and return 201', async (t) => {
    const body = {
      name: 'Guess my name',
      questions: [
        {
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
        }
      ]
    };
    const response = await app.inject({
      method: 'POST',
      url: '/quizzes',
      body
    });

    const parsedResponse = response.json();
    t.same(parsedResponse.data, body);
    t.equal(parsedResponse.statusCode, 201);
  });

  t.test('should return a bad request error because there is no quiz name', async (t) => {
    const body = {
      questions: [
        {
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
        }

      ]
    };
    const response = await app.inject({
      method: 'POST',
      url: '/quizzes',
      body
    });

    const parsedResponse = response.json();
    t.equal(parsedResponse.message, "body should have required property 'name'");
    t.equal(parsedResponse.statusCode, 400);
  });

  t.test('should return a bad request error because there are no questions', async (t) => {
    const body = {
      name: 'Guess my name'
    };
    const response = await app.inject({
      method: 'POST',
      url: '/quizzes',
      body
    });

    const parsedResponse = response.json();
    t.equal(parsedResponse.message, "body should have required property 'questions'");
    t.equal(parsedResponse.statusCode, 400);
  });

  t.test('should return a bad request error because there are no questions', async (t) => {
    const body = {
      name: 'Guess my name'
    };
    const response = await app.inject({
      method: 'POST',
      url: '/quizzes',
      body
    });

    const parsedResponse = response.json();
    t.equal(parsedResponse.message, "body should have required property 'questions'");
    t.equal(parsedResponse.statusCode, 400);
  });

  t.test('should return a bad request error because questions must be an array', async (t) => {
    const body = {
      name: 'Guess my name',
      questions: {}
    };
    const response = await app.inject({
      method: 'POST',
      url: '/quizzes',
      body
    });

    const parsedResponse = response.json();
    t.equal(parsedResponse.message, 'body.questions should be array');
    t.equal(parsedResponse.statusCode, 400);
  });

  t.test('should return a bad request error because questions array must have at least one element', async (t) => {
    const body = {
      name: 'Guess my name',
      questions: []
    };
    const response = await app.inject({
      method: 'POST',
      url: '/quizzes',
      body
    });

    const parsedResponse = response.json();
    t.equal(parsedResponse.message, 'body.questions should NOT have fewer than 1 items');
    t.equal(parsedResponse.statusCode, 400);
  });

  t.test('should return a bad request error because answers array must have 4 elements', async (t) => {
    const body = {
      name: 'Guess my name',
      questions: [
        {
          name: "What's your name?",
          answers: [
            {
              name: 'Fabrizio',
              isCorrect: true
            }
          ]
        }
      ]
    };

    const response = await app.inject({
      method: 'POST',
      url: '/quizzes',
      body
    });

    const parsedResponse = response.json();
    t.equal(parsedResponse.message, 'body.questions[0].answers should NOT have fewer than 4 items');
    t.equal(parsedResponse.statusCode, 400);
  });

  t.test('should return a bad request error because there are duplicated questions', async (t) => {
    const body = {
      name: 'Guess my name',
      questions: [
        {
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
        },
        {
          name: "What's your name?",
          answers: [
            {
              name: 'Paolo',
              isCorrect: true
            },
            {

              name: 'Mirco',
              isCorrect: false
            },
            {

              name: 'Filippo',
              isCorrect: false
            },
            {

              name: 'Eric',
              isCorrect: false
            }
          ]
        }
      ]
    };

    const response = await app.inject({
      method: 'POST',
      url: '/quizzes',
      body
    });

    const parsedResponse = response.json();
    t.equal(parsedResponse.message, "The following questions are duplicated: 'What's your name?'");
    t.equal(parsedResponse.statusCode, 400);
  });

  t.test('should return a bad request error because there is more than one correct answer', async (t) => {
    const body = {
      name: 'Guess my name',
      questions: [
        {
          name: "What's your name?",
          answers: [
            {
              name: 'Fabrizio',
              isCorrect: true
            },
            {

              name: 'Giovanni',
              isCorrect: true
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
        }
      ]
    };

    const response = await app.inject({
      method: 'POST',
      url: '/quizzes',
      body
    });

    const parsedResponse = response.json();
    t.equal(parsedResponse.message, "The following questions have more than one correct answer: 'What's your name?'");
    t.equal(parsedResponse.statusCode, 400);
  });

  t.test('should return a bad request error because there are 2 answer with same name and different isCorrect values', async (t) => {
    const body = {
      name: 'Guess my name',
      questions: [
        {
          name: "What's your name?",
          answers: [
            {
              name: 'Fabrizio',
              isCorrect: true
            },
            {

              name: 'Fabrizio',
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
        }
      ]
    };

    const response = await app.inject({
      method: 'POST',
      url: '/quizzes',
      body
    });

    const parsedResponse = response.json();
    t.equal(parsedResponse.message, "The following questions have same answers with different 'isCorrect' values: 'Fabrizio'");
    t.equal(parsedResponse.statusCode, 400);
  });
});


import { test } from 'tap';
import { buildQuizPlugin } from '../../helper.js';
test('buildCreateQuizQuery()', async (t) => {
  t.plan(1);
  t.test('should return the correct query to create a quiz', async (t) => {
    const app = await buildQuizPlugin(t);

    const quiz = {
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

    const expectedQuery = {
      data: {
        userId: 1,
        name: 'Guess my name',
        questions: {
          create: [
            {
              name: "What's your name?",
              answers: {
                create: [
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
            }
          ]
        }
      },
      include: {
        questions: {
          include: {
            answers: true
          }
        }
      }
    };
    t.same(app.buildCreateQuizQuery({ quiz, userId: 1 }), expectedQuery);
  });
});


import { test } from 'tap';
import { build } from '../helper.js';
test('buildCreateQuizQuery()', async (t) => {
  t.plan(1);
  t.test('should return the correct query to create a quiz', async (t) => {
    const app = await build(t);

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
    t.same(app.buildCreateQuizQuery({ quiz }), expectedQuery);
  });
});

test('getQuizById()', async (t) => {
  t.plan(3);
  t.test('should return the quiz', async (t) => {
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
    const app = await build(t);

    const prisma = {
      quiz: {
        findUnique: () => quiz
      }
    };
    const response = await app.getQuizById({
      prisma,
      quizId: 1
    });
    t.same(response, quiz);
  });

  t.test('should throw not found error when prisma throws an error code P2025', async (t) => {
    class CustomError extends Error {
      constructor () {
        super();
        this.code = 'P2025';
      }
    }
    const app = await build(t);

    const prisma = {
      quiz: {
        findUnique: () => { throw new CustomError(); }
      }
    };

    await t.rejects(app.getQuizById({
      prisma,
      quizId: 1
    }), new Error('A quiz with id 1 does not exis'));
  });

  t.test('should throw internal error when prisma throws an error not mapped by the function', async (t) => {
    const app = await build(t);

    const prisma = {
      quiz: {
        findUnique: () => { throw new Error('error occurred'); }
      }
    };

    await t.rejects(app.getQuizById({
      prisma,
      quizId: 1
    }), new Error('Internal Server Error'));
  });
});

test('updateQuizNameById()', async (t) => {
  t.plan(3);
  t.test('should return the correct quiz updated', async (t) => {
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
    const app = await build(t);

    const prisma = {
      quiz: {
        update: () => quiz
      }
    };
    const response = await app.updateQuizNameById({
      prisma,
      id: 1,
      name: 'New quiiz name'
    });
    t.same(response, quiz);
  });

  t.test('should throw not found error when prisma throws an error code P2025', async (t) => {
    class CustomError extends Error {
      constructor () {
        super();
        this.code = 'P2025';
      }
    }
    const app = await build(t);

    const prisma = {
      quiz: {
        update: () => { throw new CustomError(); }
      }
    };

    await t.rejects(app.updateQuizNameById({
      prisma,
      id: 1,
      name: 'New quiiz name'
    }), new Error('A quiz with id 1 does not exis'));
  });

  t.test('should throw internal error when prisma throws an error not mapped by the function', async (t) => {
    const app = await build(t);

    const prisma = {
      quiz: {
        findUnique: () => { throw new Error('error occurred'); }
      }
    };

    await t.rejects(app.updateQuizNameById({
      prisma,
      id: 1,
      name: 'New quiiz name'
    }), new Error('Internal Server Error'));
  });
});

test('updateQuestionsAndAnswers()', async (t) => {
  t.plan(3);
  t.test('should throw a not found error when prisma.question.update throws an error P2025', async (t) => {
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
    class CustomError extends Error {
      constructor () {
        super();
        this.code = 'P2025';
      }
    }
    const app = await build(t);

    const prisma = {
      question: {
        update: () => { throw new CustomError(); }
      }
    };

    await t.rejects(app.updateQuestionsAndAnswers({
      prisma,
      questions: quiz.questions
    }), new Error('Questions or answers not found'));
  });

  t.test('should throw a not found error when prisma.answer.update throws an error P2025', async (t) => {
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
    class CustomError extends Error {
      constructor () {
        super();
        this.code = 'P2025';
      }
    }
    const app = await build(t);

    const prisma = {
      question: {
        update: () => {}
      },
      answer: {
        update: () => { throw new CustomError(); }
      }
    };

    await t.rejects(app.updateQuestionsAndAnswers({
      prisma,
      questions: quiz.questions
    }), new Error('Questions or answers not found'));
  });

  t.test('should throw an internal error when prisma throws an error not mapped by the function', async (t) => {
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

    const app = await build(t);

    const prisma = {
      question: {
        update: () => {}
      },
      answer: {
        update: () => { throw new Error('error occurred'); }
      }
    };

    await t.rejects(app.updateQuestionsAndAnswers({
      prisma,
      questions: quiz.questions
    }), new Error('Internal Server Error'));
  });
});

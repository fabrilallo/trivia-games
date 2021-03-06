
import { test } from 'tap';
import { buildQuizPlugin } from '../../helper.js';

test('createQuiz()', async (t) => {
  t.plan(3);
  t.test('should return the correct quiz created', async (t) => {
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
    const app = await buildQuizPlugin(t, {
      quiz: { create: () => quiz }
    });

    const response = await app.createQuiz({
      quiz,
      userId: 1
    });
    t.same(response, quiz);
  });

  t.test('should throw a conflitct error when prisma throws an error code P2002', async (t) => {
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
        this.code = 'P2002';
      }
    }
    const app = await buildQuizPlugin(t, {
      quiz: {
        create: () => { throw new CustomError(); }
      }
    });

    await t.rejects(app.createQuiz({
      quiz,
      userId: 1

    }), new Error(`A quiz named ${quiz.name} already exists`));
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

    const app = await buildQuizPlugin(t, {
      quiz: {
        create: () => { throw new Error('error occurred'); }
      }
    });

    await t.rejects(app.createQuiz({
      quiz,
      userId: 1
    }), new Error('Internal Server Error'));
  });
});

test('updateQuiz()', async (t) => {
  t.plan(5);
  t.test('should return the correct quiz updated', async (t) => {
    const quiz = {
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
    const app = await buildQuizPlugin(t, {
      quiz: {
        findMany: () => [quiz],
        update: () => {}
      }
    });

    const response = await app.updateQuiz({
      quiz,
      quizId: 1,
      userId: 1
    });
    t.same(response, quiz);
  });

  t.test('should return the correct quiz updated (only questions)', async (t) => {
    const quizToReturn = {
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

    const quizToUpdate = {
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
              name: 'Paolo',
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
    const app = await buildQuizPlugin(t, {
      quiz: {
        findMany: () => [quizToReturn],
        update: () => {}
      }
    });

    const response = await app.updateQuiz({
      quiz: quizToUpdate,
      quizId: 1,
      userId: 1

    });
    t.same(response, quizToReturn);
  });

  t.test('should return the correct quiz updated (only NAME)', async (t) => {
    const quizToReturn = {
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

    const quizToUpdate = {
      name: 'Guess my name!!!'
    };
    const app = await buildQuizPlugin(t, {
      quiz: {
        update: () => quizToReturn,
        findMany: () => [quizToReturn]
      }
    });

    const response = await app.updateQuiz({
      quiz: quizToUpdate,
      quizId: 1,
      userId: 1

    });
    t.same(response, quizToReturn);
  });

  t.test('should throw a not found error when prisma throws an error code P2025', async (t) => {
    const quiz = {
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
    class CustomError extends Error {
      constructor () {
        super();
        this.code = 'P2025';
      }
    }
    const app = await buildQuizPlugin(t, {

      $transaction: () => { throw new CustomError(); }

    });

    await t.rejects(app.updateQuiz({
      quiz,
      quizId: 1,
      userId: 1

    }), new Error('A quiz with id 1 does not exist'));
  });

  t.test('should throw an internal error when prisma throws an error not mapped by the function', async (t) => {
    const quiz = {
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

    const app = await buildQuizPlugin(t, {
      $transaction: () => { throw new Error('error occurred'); }

    });

    await t.rejects(app.updateQuiz({
      quiz,
      quizId: 1,
      userId: 1

    }), new Error('Internal Server Error'));
  });
});

test('getQuizzes()', async (t) => {
  t.plan(2);
  t.test('should return the quizzes list', async (t) => {
    const quizzes = [{
      id: 1,
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
    }];
    const app = await buildQuizPlugin(t, {
      quiz: {
        findMany: () => quizzes
      }
    });

    const response = await app.getQuizzes({ userId: 1 });
    t.same(response, quizzes);
  });

  t.test('should throw an internal error when prisma throws an error', async (t) => {
    const app = await buildQuizPlugin(t, {
      quiz: {
        findMany: () => { throw new Error('error occurred'); }
      }
    });

    await t.rejects(app.getQuizzes({ userId: 1 }), new Error('Internal Server Error'));
  });
});

test('deleteQuiz()', async (t) => {
  t.plan(3);
  t.test('should return the quiz deleted', async (t) => {
    const quiz = {
      id: 1,
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
    const app = await buildQuizPlugin(t, {
      quiz: {
        delete: () => quiz,
        findMany: () => [quiz]

      }
    });

    const response = await app.deleteQuiz({ id: 1, userId: 1 });
    t.same(response, quiz);
  });

  t.test('should throw a not found error when prisma throws an error code P2025', async (t) => {
    class CustomError extends Error {
      constructor () {
        super();
        this.code = 'P2025';
      }
    }
    const app = await buildQuizPlugin(t, {
      quiz: {
        delete: () => { throw new CustomError(); },
        findMany: () => [undefined]
      }
    });

    await t.rejects(app.deleteQuiz({ id: 1, userId: 1 }), new Error('A quiz with id 1 does not exist'));
  });

  t.test('should throw an internal error when prisma throws an error', async (t) => {
    const app = await buildQuizPlugin(t, {
      quiz: {
        delete: () => { throw new Error('error occurred'); }
      }
    });

    await t.rejects(app.deleteQuiz({ id: 1, userId: 1 }), new Error('Internal Server Error'));
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
    const app = await buildQuizPlugin(t);

    const prisma = {
      quiz: {
        findMany: () => [quiz]
      }
    };
    const response = await app.getQuizById({
      prisma,
      quizId: 1,
      userId: 1
    });
    t.same(response, quiz);
  });

  t.test('should throw not found error when prisma return undefined', async (t) => {
    const app = await buildQuizPlugin(t);

    const prisma = {
      quiz: {
        findMany: () => [undefined]
      }
    };

    await t.rejects(app.getQuizById({
      prisma,
      quizId: 1,
      userId: 1
    }), new Error('A quiz with id 1 does not exist'));
  });

  t.test('should throw internal error when prisma throws an error not mapped by the function', async (t) => {
    const app = await buildQuizPlugin(t);

    const prisma = {
      quiz: {
        findUnique: () => { throw new Error('error occurred'); }
      }
    };

    await t.rejects(app.getQuizById({
      prisma,
      quizId: 1,
      userId: 1
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
    const app = await buildQuizPlugin(t);

    const prisma = {
      quiz: {
        update: () => quiz
      }
    };
    const response = await app.updateQuizNameById({
      prisma,
      id: 1,
      name: 'New quiiz name',
      userId: 1
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
    const app = await buildQuizPlugin(t);

    const prisma = {
      quiz: {
        update: () => { throw new CustomError(); }
      }
    };

    await t.rejects(app.updateQuizNameById({
      prisma,
      id: 1,
      name: 'New quiiz name',
      userId: 1
    }), new Error('A quiz with id 1 does not exis'));
  });

  t.test('should throw internal error when prisma throws an error not mapped by the function', async (t) => {
    const app = await buildQuizPlugin(t);

    const prisma = {
      quiz: {
        findUnique: () => { throw new Error('error occurred'); }
      }
    };

    await t.rejects(app.updateQuizNameById({
      prisma,
      id: 1,
      name: 'New quiiz name',
      userId: 1
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
    const app = await buildQuizPlugin(t);

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
    const app = await buildQuizPlugin(t);

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

    const app = await buildQuizPlugin(t);

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

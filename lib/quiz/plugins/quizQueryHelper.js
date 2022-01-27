
import fp from 'fastify-plugin';

async function quizQueryHelper (fastify, _opts) {
  fastify.decorate('buildCreateQuizQuery', buildCreateQuizQuery);

  function buildCreateQuizQuery ({ quiz, userId }) {
    const questionsQuery = quiz.questions.map((question) => {
      question.answers = {
        create: [...question.answers]
      };

      return question;
    });

    const finalQuery = {
      data: {
        name: quiz.name,
        userId,
        questions: {
          create: [...questionsQuery]
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

    return finalQuery;
  }
}

export default fp(quizQueryHelper, {
  name: 'quizQueryHelper',
  dependencies: ['fastify-sensible']
})
;

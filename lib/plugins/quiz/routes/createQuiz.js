import S from 'fluent-schema';
/**
 * This plugin contains the route to create a quiz
*/
export default async function createQuiz (fastify, opts) {
  const {
    httpErrors,
    getDuplicatedItems,
    isCorrectValueUnique
  } = fastify;

  fastify.route({
    method: 'POST',
    path: '/quizzes',
    schema: {
      body: S.object()
        .additionalProperties(false)
        .prop('name', S.string())
        .prop('questions',
          S.array().items(
            S.object()
              .additionalProperties(false)
              .prop('name', S.string())
              .prop('answers',
                S.array().items(
                  S.object()
                    .additionalProperties(false)
                    .prop('name', S.string())
                    .prop('isCorrect', S.boolean())
                    .required(['name', 'isCorrect'])
                ).minItems(4).maxItems(4).uniqueItems(true)
              )
              .required(['name', 'answers'])
          ).minItems(1).uniqueItems(true)
        )
        .required(['name', 'questions'])
    },
    handler: createQuizHandler
  });

  async function createQuizHandler (req, reply) {
    const { questions } = req.body;

    const duplicatedQuestions = getDuplicatedItems(questions);

    if (duplicatedQuestions.length !== 0) {
      const invalidQuestionNames = duplicatedQuestions.join("','");
      throw httpErrors.badRequest(`The following questions are duplicated: '${invalidQuestionNames}'`);
    }

    const invalidIsCorrectQuests = [];
    const questWithDuplicatedAnswers = [];

    for (const question of questions) {
      if (!isCorrectValueUnique(question.answers)) {
        invalidIsCorrectQuests.push(question.name);
      }

      /*
        NOTE: This check is made for the edge case
              when there is a same answer with different isCorrect value.
              JSON schema don't catch this specific edge case but catches
              the case with same answers name and isCorrect values.
      */
      questWithDuplicatedAnswers.push(...getDuplicatedItems(question.answers));
    }

    if (invalidIsCorrectQuests.length !== 0) {
      const invalidQuestionNames = invalidIsCorrectQuests.join("','");
      throw httpErrors.badRequest(`The following questions have more than one correct answer: '${invalidQuestionNames}'`);
    }

    if (questWithDuplicatedAnswers.length !== 0) {
      const invalidQuestionNames = questWithDuplicatedAnswers.join("','");
      throw httpErrors.badRequest(`The following questions have same answers with different 'isCorrect' values: '${invalidQuestionNames}'`);
    }

    reply.code(201).send({
      statusCode: 201,
      message: 'Quiz created successfully',
      data: req.body
    });
  }
}

/**
 * This plugin contains the route to update a quiz
*/

import S from 'fluent-schema';

export default async function updateQuiz (fastify, opts) {
  const {
    httpErrors,
    getDuplicatedItems,
    isCorrectValueUnique,
    updateQuiz
  } = fastify;

  fastify.route({
    method: 'PUT',
    path: '/quizzes/:id',
    schema: {
      body: getBodySchema(),
      params: S.object().prop('id', S.string().pattern('^[0-9]*$').not(S.null()).required())

    },
    preHandler: fastify.auth([fastify.verifyJWT]),
    handler: updateQuizHandler
  });

  function getBodySchema () {
    return S.anyOf([
      S.object().additionalProperties(false)
        .prop('name', S.string())
        .prop('questions',
          S.array().items(
            S.object()
              .additionalProperties(false)
              .prop('name', S.string())
              .prop('id', S.integer())
              .prop('answers',
                S.array().items(
                  S.object()
                    .additionalProperties(false)
                    .prop('name', S.string())
                    .prop('isCorrect', S.boolean())
                    .prop('id', S.integer())
                    .required(['name', 'isCorrect', 'id'])
                ).minItems(4).maxItems(4).uniqueItems(true)
              )
              .required(['name', 'answers', 'id'])
          ).minItems(1).uniqueItems(true)
        ).required(['name']),
      S.object().additionalProperties(false)
        .prop('questions',
          S.array().items(
            S.object()
              .additionalProperties(false)
              .prop('name', S.string())
              .prop('id', S.integer())
              .prop('answers',
                S.array().items(
                  S.object()
                    .additionalProperties(false)
                    .prop('name', S.string())
                    .prop('isCorrect', S.boolean())
                    .prop('id', S.integer())
                    .required(['name', 'isCorrect', 'id'])
                ).minItems(4).maxItems(4).uniqueItems(true)
              )
              .required(['name', 'answers', 'id'])
          ).minItems(1).uniqueItems(true)
        ).required(['questions']),
      S.object().additionalProperties(false)
        .prop('name', S.string())
        .prop('questions',
          S.array().items(
            S.object()
              .additionalProperties(false)
              .prop('name', S.string())
              .prop('id', S.integer())
              .prop('answers',
                S.array().items(
                  S.object()
                    .additionalProperties(false)
                    .prop('name', S.string())
                    .prop('isCorrect', S.boolean())
                    .prop('id', S.integer())
                    .required(['name', 'isCorrect', 'id'])
                ).minItems(4).maxItems(4).uniqueItems(true)
              )
              .required(['name', 'answers', 'id'])
          ).minItems(1).uniqueItems(true)
        )
        .required(['name', 'questions'])
    ]);
  }

  async function updateQuizHandler (req, reply) {
    const { questions } = req.body;
    const user = req.user;

    if (questions != undefined && questions.length !== 0) { // eslint-disable-line eqeqeq
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
    }

    const updatedQuiz = await updateQuiz({ quizId: req.params.id, quiz: req.body, userId: user.id });

    reply.code(200).send({
      statusCode: 200,
      message: `Quiz ${req.params.id} updated successfully`,
      data: updatedQuiz
    });
  }
}

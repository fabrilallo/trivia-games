
import fp from 'fastify-plugin';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
async function authentication (fastify, opts) {
  const { httpErrors, prismaClient } = fastify;

  fastify.decorate('verifyJWT', verifyJWT);
  fastify.decorate('findByToken', findByToken);
  fastify.decorate('verifyUsernameAndPassword', verifyUsernameAndPassword);
  fastify.decorate('generateUserToken', generateUserToken);
  fastify.decorate('findByCredentials', findByCredentials);

  fastify.decorateRequest('user', null);

  async function verifyJWT (request, reply) {
    try {
      if (!request.headers.authorization) {
        throw httpErrors.badRequest('No token was sent');
      }
      const token = request.headers.authorization.replace('Bearer ', '');
      const user = await findByToken({ token });
      if (!user) {
        throw httpErrors.badRequest('Authentication failed');
      }
      request.user = user;
    } catch (error) {
      reply.code(error.statusCode).send(error);
    }
  }

  async function findByToken ({ token }) {
    try {
      const [user] = await prismaClient.user.findMany({
        where: {
          token
        }
      });

      return user;
    } catch (error) {
      throw httpErrors.internalServerError();
    }
  }

  async function verifyUsernameAndPassword (request, reply) {
    try {
      if (!request.body) {
        throw httpErrors.badRequest('Email and password are mandatory');
      }
      const user = await findByCredentials({ email: request.body.email, password: request.body.password });

      if (!user) {
        throw httpErrors.badRequest('Email or password are not correct');
      }
      request.user = user;
    } catch (error) {
      reply.code(error.statusCode).send(error);
    }
  }

  async function findByCredentials ({ email, password }) {
    try {
      const [user] = await prismaClient.user.findMany({
        where: {
          email
        }
      });

      if (user == undefined) { // eslint-disable-line eqeqeq
        return undefined;
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return undefined;
      }
      return user;
    } catch (error) {
      throw httpErrors.internalServerError();
    }
  }

  async function generateUserToken ({ userId }) {
    try {
      const convertedUserId = Number.parseInt(userId);
      const token = jwt.sign({ id: convertedUserId }, process.env.JWT_SECRET, { expiresIn: '72h' });

      const user = await prismaClient.user.update({
        data: {
          token
        },
        where: {
          id: convertedUserId

        }
      });

      return user;
    } catch (error) {
      // prisma error code for record not found
      if (error.code && error.code === 'P2025') {
        return undefined;
      }
      throw httpErrors.internalServerError();
    }
  }
}

export default fp(authentication, {
  name: 'authentication',
  dependencies: ['fastify-sensible', 'prismaClient']
})
;

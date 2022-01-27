
import fp from 'fastify-plugin';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
async function userQuery (fastify, _opts) {
  const {
    httpErrors,
    prismaClient
  } = fastify;

  fastify.decorate('createUser', createUser);
  fastify.decorate('createUserWithToken', createUserWithToken);
  fastify.decorate('deleteUserById', deleteUserById);
  fastify.decorate('updateUserById', updateUserById);
  fastify.decorate('getUserById', getUserById);

  async function createUser ({ prisma, email, password }) {
    try {
      const client = prisma || prismaClient;

      const newUser = await client.user.create({
        data: {
          email,
          password
        }
      });

      return newUser;
    } catch (error) {
      // prisma error code for record already present
      if (error.code && error.code === 'P2002') {
        throw httpErrors.conflict(
            `A user with the email ${email} already exists`
        );
      }

      throw httpErrors.internalServerError();
    }
  }

  async function deleteUserById ({ prisma, id }) {
    try {
      const client = prisma || prismaClient;

      const convertedId = Number.parseInt(id);
      const deletedUser = await client.user.delete({
        where: {
          id: convertedId
        }
      });

      return deletedUser;
    } catch (error) {
      // prisma error code for record not found
      if (error.code && error.code === 'P2025') {
        throw httpErrors.notFound(
            `User ${id} not found`
        );
      }

      throw httpErrors.internalServerError();
    }
  }

  async function getUserById ({ prisma, id }) {
    try {
      const client = prisma || prismaClient;

      const convertedId = Number.parseInt(id);

      const user = await client.user.findUnique({
        where: {
          id: convertedId
        }
      });

      if (user == null) {
        throw httpErrors.notFound(`User ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw httpErrors.internalServerError();
    }
  }

  async function updateUserById ({ prisma, id, data }) {
    try {
      const client = prisma || prismaClient;
      const converteduserId = Number.parseInt(id);
      const user = await client.user.update({
        data: { ...data },
        where: {
          id: converteduserId
        }
      });

      return user;
    } catch (error) {
      // prisma error code for record not found
      if (error.code && error.code === 'P2025') {
        throw httpErrors.notFound(`User ${id} not found`);
      }
      throw httpErrors.internalServerError();
    }
  }

  async function createUserWithToken ({ email, password }) {
    try {
      return prismaClient.$transaction(async (prisma) => {
        const hashedPassword = await bcrypt.hash(password, 8);
        const newUser = await createUser({ prisma, email, password: hashedPassword });
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '72h' });
        const updatedUser = await updateUserById({ prisma, id: newUser.id, data: { token } });

        return updatedUser;
      });
    } catch (error) {
    // prisma error code for record already present
      if (error.code && error.code === 'P2002') {
        throw httpErrors.conflict(
            `A user with the email ${email} already exists`
        );
      }

      throw httpErrors.internalServerError();
    }
  }
}
export default fp(userQuery, {
  name: 'userQuery',
  dependencies: ['prismaClient', 'fastify-sensible']
})
;

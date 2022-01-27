
import { test } from 'tap';
import { buildUserPlugin } from '../../helper.js';

test('createUser()', async (t) => {
  t.plan(3);

  t.test('should return the user created', async (t) => {
    const user = {
      email: 'user@gmail.com',
      password: 'password1234'
    };

    const prisma = {
      user: {
        create: () => user
      }
    };
    const app = await buildUserPlugin(t);

    t.same(await app.createUser({
      prisma,
      email: user.email,
      password: user.password
    }), user);
  });

  t.test('should throw a conflitct error when prisma throws an error code P2002', async (t) => {
    const user = {
      email: 'user@gmail.com',
      password: 'password1234'
    };
    class CustomError extends Error {
      constructor () {
        super();
        this.code = 'P2002';
      }
    }

    const prisma = {
      user: {
        create: () => { throw new CustomError(); }
      }
    };
    const app = await buildUserPlugin(t);

    await t.rejects(app.createUser({
      prisma,
      email: user.email,
      password: user.password
    }), new Error(`A user with the email ${user.email} already exists`));
  });

  t.test('should throw an internal error when prisma throws an error not mapped by the function', async (t) => {
    const user = {
      email: 'user@gmail.com',
      password: 'password1234'
    };

    const prisma = {
      user: {
        create: () => { throw new Error('an error occurred'); }
      }
    };
    const app = await buildUserPlugin(t);

    await t.rejects(app.createUser({
      prisma,
      email: user.email,
      password: user.password
    }), new Error('Internal Server Error'));
  });
});

test('deleteUserById()', async (t) => {
  t.plan(3);

  t.test('should return the user deleted', async (t) => {
    const user = {
      email: 'user@gmail.com'
    };

    const prisma = {
      user: {
        delete: () => user
      }
    };
    const app = await buildUserPlugin(t);

    t.same(await app.deleteUserById({
      prisma,
      id: 1
    }), user);
  });

  t.test('should throw a not found error when prisma throws an error code P2025', async (t) => {
    class CustomError extends Error {
      constructor () {
        super();
        this.code = 'P2025';
      }
    }

    const prisma = {
      user: {
        delete: () => { throw new CustomError(); }
      }
    };
    const app = await buildUserPlugin(t);

    await t.rejects(app.deleteUserById({
      prisma,
      id: 1
    }), new Error('User 1 not found'));
  });

  t.test('should throw an internal error when prisma throws an error not mapped by the function', async (t) => {
    const prisma = {
      user: {
        delete: () => { throw new Error('an error occurred'); }
      }
    };
    const app = await buildUserPlugin(t);

    await t.rejects(app.deleteUserById({
      prisma,
      id: 1
    }), new Error('Internal Server Error'));
  });
});

test('getUserById()', async (t) => {
  t.plan(3);
  t.test('should return the user retrieved', async (t) => {
    const user = {
      email: 'user@gmail.com'
    };

    const prisma = {
      user: {
        findUnique: () => user
      }
    };
    const app = await buildUserPlugin(t);

    t.same(await app.getUserById({
      prisma,
      id: 1
    }), user);
  });

  t.test('should throw a not found error when the user does not exist', async (t) => {
    const prisma = {
      user: {
        findUnique: () => null
      }
    };
    const app = await buildUserPlugin(t);

    await t.rejects(app.getUserById({
      prisma,
      id: 1
    }), new Error('User 1 not found'));
  });

  t.test('should throw an internal error when prisma throws an error not mapped by the function', async (t) => {
    const prisma = {
      user: {
        findUnique: () => { throw new Error('an error occurred'); }
      }
    };
    const app = await buildUserPlugin(t);

    await t.rejects(app.getUserById({
      prisma,
      id: 1
    }), new Error('Internal Server Error'));
  });
});

test('updateUserById()', async (t) => {
  t.plan(3);

  t.test('should return the user updated', async (t) => {
    const data = {
      email: 'user@gmail.com',
      password: 'password1234'
    };

    const prisma = {
      user: {
        update: () => data
      }
    };
    const app = await buildUserPlugin(t);

    t.same(await app.updateUserById({
      prisma,
      id: 1,
      data
    }), data);
  });

  t.test('should throw a not found error when prisma throws an error code P2025', async (t) => {
    const data = {
      email: 'user@gmail.com',
      password: 'password1234'
    };
    class CustomError extends Error {
      constructor () {
        super();
        this.code = 'P2025';
      }
    }

    const prisma = {
      user: {
        update: () => { throw new CustomError(); }
      }
    };
    const app = await buildUserPlugin(t);

    await t.rejects(app.updateUserById({
      prisma,
      id: 1,
      data
    }), new Error('User 1 not found'));
  });

  t.test('should throw an internal error when prisma throws an error not mapped by the function', async (t) => {
    const data = {
      email: 'user@gmail.com',
      password: 'password1234'
    };

    const prisma = {
      user: {
        update: () => { throw new Error('an error occurred'); }
      }
    };
    const app = await buildUserPlugin(t);

    await t.rejects(app.updateUserById({
      prisma,
      id: 1,
      data
    }), new Error('Internal Server Error'));
  });
});

test('createUserWithToken()', async (t) => {
  t.plan(3);
  t.test('should return the user created', async (t) => {
    const user = {
      email: 'user@gmail.com',
      password: 'password1234'
    };

    const app = await buildUserPlugin(t, {
      user: {
        update: () => user,
        create: () => { return { id: 1, ...user }; }
      }
    });

    t.same(await app.createUserWithToken(
      {
        email: user.email,
        password: user.password
      }
    ), user);
  });

  t.test('should throw a conflitct error when prisma throws an error code P2002', async (t) => {
    const user = {
      email: 'user@gmail.com',
      password: 'password1234'
    };
    class CustomError extends Error {
      constructor () {
        super();
        this.code = 'P2002';
      }
    }

    const app = await buildUserPlugin(t, {
      $transaction: () => { throw new CustomError(); }

    });

    await t.rejects(app.createUserWithToken(
      {
        email: user.email,
        password: user.password
      }
    ), new Error(`A user with the email ${user.email} already exists`));
  });

  t.test('should throw an internal error when prisma throws an error not mapped by the function', async (t) => {
    const user = {
      email: 'user@gmail.com',
      password: 'password1234'
    };

    const app = await buildUserPlugin(t, {
      $transaction: () => { throw new Error('error occurred'); }

    });
    await t.rejects(app.createUserWithToken(
      {
        email: user.email,
        password: user.password
      }
    ), new Error('Internal Server Error'));
  });
})
;

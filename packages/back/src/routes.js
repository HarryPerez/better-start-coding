const health = require('./controllers/health_check');
const {
  saveUser, signIn, getUser, changePasswordFlow,
  updatePassword, getUsers, updateUser, deleteUser, getUserById,
} = require('./controllers/users');

const { validateSchemaAndFail } = require('./middlewares/params');
const mongoQueries = require('./middlewares/mongo_queries');

const { authenticateUser: authenticate, authenticatePasswordChange, isAdmin } = require('./middlewares/auth');

const {
  usersSchema, signInSchema,
  passwordSchema, emailSchema,
} = require('./schemas');

module.exports = (app) => {
  // web app
  app.get('/health', health);

  app.post('/users', [authenticate, isAdmin, validateSchemaAndFail(usersSchema)], saveUser);
  app.post('/users/forgot_password', [validateSchemaAndFail(emailSchema)], changePasswordFlow);
  app.post('/users/password', [validateSchemaAndFail(passwordSchema), authenticatePasswordChange], updatePassword);
  app.post('/sign_in', [validateSchemaAndFail(signInSchema)], signIn);
  app.get('/users/:id', [authenticate, isAdmin, mongoQueries], getUserById);
  app.put('/users/:id', [authenticate, isAdmin, mongoQueries], updateUser);
  app.delete('/users/:id', [authenticate, isAdmin, mongoQueries], deleteUser);
  app.get('/users', [authenticate, isAdmin, mongoQueries], getUsers);

  app.get('/me', [authenticate], getUser);
};

const unauthorizedUser = (message, internalCode) => ({
  code: 401,
  message,
  internalCode,
});

const invalidKeys = (message, internalCode) => ({
  code: 400,
  message,
  internalCode,
});

const entityAlreadyExists = (id, entity, internalCode) => ({ code: 400, message: `The ${entity} with ${id} already exists`, internalCode });

const entityNotFound = (id, entity, internalCode) => ({ code: 404, message: `The ${entity} with ${id} was not found`, internalCode });

const forbiddenUser = (message, internalCode) => ({
  code: 403,
  message,
  internalCode,
});

const tokenExpired = (internalCode) => ({
  code: 401,
  message: 'Token expired',
  internalCode,
});

const invalidSignature = (internalCode) => ({
  code: 400,
  message: 'Bad token',
  internalCode,
});

const invalidApiKey = (internalCode) => ({
  code: 401,
  message: 'The API key is invalid',
  internalCode,
});

const invalidMongoIdError = (id, internalCode) => ({
  code: 400,
  message: `Invalid id ${id}`,
  internalCode,
});

const JWT_ERRORS = {
  'jwt expired': (res) => ({ err: tokenExpired('2004'), res }),
  'invalid signature': (res) => ({ err: invalidSignature('2007'), res }),
};

module.exports = {
  unauthorizedUser,
  entityAlreadyExists,
  entityNotFound,
  forbiddenUser,
  tokenExpired,
  invalidSignature,
  invalidKeys,
  invalidMongoIdError,
  invalidApiKey,
  JWT_ERRORS,
};

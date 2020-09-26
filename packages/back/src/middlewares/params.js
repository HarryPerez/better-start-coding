const { checkSchema, validationResult } = require('express-validator');

const formatValidationErrors = (validationErrors) => validationErrors
  .array({ onlyFirstError: true })
  .map((e) => e.msg);

// eslint-disable-next-line consistent-return
const throwValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res
      .status(400)
      .send(formatValidationErrors(validationErrors));
  }
  next();
};

const validateSchema = (schema) => checkSchema(schema);

const validateSchemaAndFail = (schema) => [validateSchema(schema), throwValidationErrors];

module.exports = { validateSchemaAndFail };

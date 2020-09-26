const { FIELDS_TYPES_PER_MODEL, MONGO_KEYS, MONGO_TRANSFORMATIONS } = require('../constants');

const getModelFields = (model) => Object.keys(model.schema.paths);

const caseInsensitiveILike = (string) => new RegExp(`.*${string}.*`, 'i');

const buildQueryForAnyField = (value, collection) => {
  const { string: stringFields, number: numberFields } = FIELDS_TYPES_PER_MODEL[collection];
  const or = [];
  stringFields.forEach((field) => {
    or.push({ [field]: caseInsensitiveILike(value) });
  });
  if (parseInt(value, 10)) {
    numberFields.forEach((field) => {
      or.push({ [field]: parseInt(value, 10) });
    });
  }
  return or;
};

const mapMongoQuery = (query, field) => {
  const object = {};
  if ((typeof query !== 'object')
      || field === 'any') return query;
  Object.keys(query).forEach((oldKey) => {
    const value = query[oldKey];
    const mongoKey = MONGO_KEYS[oldKey] || oldKey;
    const map = MONGO_TRANSFORMATIONS[field];
    object[mongoKey] = map ? map(value) : value;
  });
  return object || query;
};

const parseRanges = (query) => {
  const queryCopy = { ...query };
  Object.keys(query).forEach((field) => {
    queryCopy[field] = mapMongoQuery(queryCopy[field], field);
  });
  return queryCopy;
};

const buildQuery = (
  Model, query, initialFilter, initialSort, initialLimit,
) => {
  const name = Model.collection.collectionName;
  if (!query[name]) {
    return Model.find(initialFilter, null, { sort: initialSort, limit: initialLimit });
  }
  const filterQuery = query[name].filter
    ? { ...query[name].filter, ...initialFilter }
    : initialFilter;
  const filter = parseRanges(filterQuery);
  if (filter.any) {
    const { any: value } = filter;
    const or = buildQueryForAnyField(value, name);
    delete filter.any;
    filter.$or = or;
  }
  const sort = query[name].sort
    ? { ...query[name].sort, ...initialSort }
    : initialSort;
  const limit = query[name].limit
    ? parseInt(query[name].limit, 10)
    : initialLimit;
  return Model.find(filter, null, { sort, limit });
};

module.exports = { buildQuery, getModelFields };

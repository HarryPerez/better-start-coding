const createMany = (Model, data) => (n, date) => {
  const promises = [];
  const dataCopy = { ...data };
  for (let i = 1; i <= n; i += 1) {
    if (date) {
      dataCopy.createdAt = date;
    }
    promises.push(new Model(dataCopy).save());
  }
  return Promise.all(promises);
};

module.exports = { createMany };

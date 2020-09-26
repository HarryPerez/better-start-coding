/* eslint-disable */
rs.initiate();
sleep(1000);

admin = db.getSiblingDB("admin");
admin.createUser(
  {
    user: adminUser,
    pwd: adminPass,
    roles: [{ role: "root", db: "admin" }]
  });

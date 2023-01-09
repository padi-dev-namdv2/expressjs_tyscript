import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize({
  host: "localhost",
  database: "expressjs_typescript",
  dialect: "mysql",
  username: "root",
  password: "",
});

export const initDB = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
};

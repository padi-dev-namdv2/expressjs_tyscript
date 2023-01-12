'use strict';
import { Sequelize } from "sequelize-typescript";
import { User } from "./User";
import { Group } from "./Group";
import { UserGroupAssociation } from "./UserGroupAssociation";
import { Blog } from "./Blog";
import { ImageBlog } from "./Imageblog";
const sequelize = new Sequelize({
  host: "localhost",
  database: "expressjs_typescript",
  dialect: "mysql",
  username: "root",
  password: "",
});
sequelize.addModels([User, Group, UserGroupAssociation, Blog, ImageBlog]); // add model
export const initDB = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
};
export { User, Group, UserGroupAssociation, Blog, sequelize };

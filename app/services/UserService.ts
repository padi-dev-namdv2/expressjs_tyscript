import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  UseBefore,
  Res,
  Req,
} from "routing-controllers";
import { checkJwt } from "../middlewares/checkJwt";
import { User, Blog, Group, UserGroupAssociation } from "../../models/index";
import { Container, Service } from "typedi";
import { Op, Transaction } from "sequelize";
import { sequelize } from "../../models/index";
const bcrypt = require("bcrypt");

@Service()
export class UserService {
  async getListUser(params: any) {
    const limitRow = 5;
    const offset = params.page ? (params.page - 1) * limitRow : 0;
    let filterUser: any = {};
    let filterBlog: any = {};
    if (params.name) {
      filterUser.name = { [Op.substring]: params.name };
    }

    if (params.blog_id) {
      filterBlog.id = { [Op.eq]: params.blog_id };
    }

    const listUser: any = await User.findAndCountAll({
      attributes: ["name", "email", "createdAt"],
      offset: offset,
      limit: limitRow,
      where: filterUser,
      include: [
        {
          model: Blog,
          attributes: ["id", "title"],
          where: Object.keys(filterBlog).length ? filterBlog : null,
        },
        {
          model: Group,
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
      distinct: true,
    });

    return {
      listUser: listUser,
      currentPage: params.page ?? 1,
    };
  }

  async userDetail(id: number) {
    return await User.findOne({
      attributes: ["name", "email", "createdAt"],
      where: {
        id: id,
      },
      include: [
        {
          model: Group,
          attributes: ["id", "name"],
          through: { attributes: [] },
        }
      ],
    });
  }

  async storeUser(params: any) {
    const salt = await bcrypt.genSalt(10);
    const t = await sequelize.transaction();
    try {
        const user: User = await User.create(
            {
                name: params.name,
                email: params.email,
                password: await bcrypt.hash(params.password, salt),
            },
            { transaction: t }
        );

        const insertUserGroup: any = Object(params.group_ids).map(function (item: number) {
            return {
              userId: user.id,
              groupId: item
            }
        });

        const userGroupAssociation = await UserGroupAssociation.bulkCreate(
            insertUserGroup,
            { transaction: t }
        )

        await t.commit();
        console.log("đã commit!");
        return true;
    } catch (error) {
        await t.rollback();
        console.log('Lỗi!');
        return false;
    }
  }
}

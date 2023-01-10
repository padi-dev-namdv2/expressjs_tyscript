import { Controller, Param, Body, Get, Post, Put, Delete, UseBefore, Res, Req } from 'routing-controllers';
import { checkJwt } from '../middlewares/checkJwt';
import { User, Blog } from '../../models/index';
import { Container, Service } from 'typedi';
import { Op } from 'sequelize';

@Service()
export class UserService {
    async getListUser(params: any) {
        const limitRow = 5;
        const offset = params.page ? (params.page - 1) * limitRow : 0;
        let filterUser: any = {};
        let filterBlog: any = {};
        if (params.name) {
            filterUser.name = {[Op.substring]: params.name};
        }

        if (params.blog_id) {
            filterBlog.id = {[Op.eq]: params.blog_id};
        }

        const listUser : any = await User.findAll({
            attributes: ['name', 'email', 'createdAt'],
            where: filterUser,
            offset: offset,
            limit: limitRow,
            include: {
              model: Blog,
              attributes: ['id', 'title'],
              where: Object.keys(filterBlog).length ? filterBlog : null,
            }
        });

        return {
            listUser: listUser,
            currentPage: params.page ?? 1
        };
    }
}
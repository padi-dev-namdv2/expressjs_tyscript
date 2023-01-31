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
import { ImageBlog } from "../../models/Imageblog";
import { EventDispatcher } from "event-dispatch";
import "../events/checkViewUpBLogEvent";
import { Helper } from "../../ultils/Helper/Helper";

@Service()
export class BlogService {
    private helper: Helper;
    constructor() {
        this.helper = new Helper();
    }

    async listBlog(params: any) {
        const limitRow = 5;
        const offset = params.page ? (params.page - 1) * limitRow : 0;
        let filterBlog: any = {};

        if (params.title) {
            filterBlog.title = {[Op.substring]: params.title}
        }

        if (params.userId) {
            filterBlog.userId = {[Op.eq]: params.userId}
        }

        const listBlog = await Blog.findAndCountAll({
            attributes: ["title", "description", "thumbmail","createdAt"],
            offset: offset,
            limit: limitRow,
            include: [
                {
                    model: User,
                    attributes: ["name"]
                }
            ],
            distinct: true,
        })

        return {
            listBlog: listBlog,
            currentPage: params.page ?? 1,
        };
    }

    async storePost(blogParams: any, imageBlog: Array<string>) {
        const t = await sequelize.transaction();
        console.log(blogParams);
        try {
            const blog: Blog = await Blog.create(
                blogParams,
                { transaction: t }
            )

            if (Object.keys(imageBlog).length) {
                const imageBlogItem = Object(imageBlog).map(function (item: any) {
                    return {
                        blogId: blog.id,
                        link: item
                    }
                });

                const imageBlogInsert: any = await ImageBlog.bulkCreate(
                    imageBlogItem,
                    { transaction: t }
                );
            }
            
            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            return false;
        }
    }

    async getOneBlog(id: number, session: any, jwt: string) {
        var blog: Blog = await Blog.findOne({
            where: {
                id: id
            }
        });

        if (blog) {
            const user: User = await this.helper.getAuthUser(jwt);
            let eventDispatcher: EventDispatcher = new EventDispatcher(); // check view by session
            eventDispatcher.dispatch("checkUpViewSession", {
                blog: blog,
                session: session,
                user: user
            });
        }
        
        return blog;
    }
}
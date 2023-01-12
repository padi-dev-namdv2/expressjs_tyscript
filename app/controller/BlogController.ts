import { Controller, Param, Body, Get, Post, Put, Delete, UseBefore, Res, Req, UploadedFile, UploadedFiles, UseAfter} from 'routing-controllers';
import { checkJwt } from '../middlewares/checkJwt';
import { validate } from "class-validator";
import { Container, Service } from 'typedi';
import { BaseController } from './BaseController';
import { BlogService } from '../services/BlogService';
import { fileUploadOptions } from '../../config/uploadImageOptions';

@Controller()
@UseBefore(checkJwt)
@Service()
export class BlogController extends BaseController {
    private blogService: BlogService;
    constructor() {
        super();
        this.blogService = new BlogService();
    }

    @Get('/blog')
    async listBlog(@Res() response: any, @Req() request: any) {
        const listBlog: any = await this.blogService.listBlog(request.query);

        return this.withData<any>(response, listBlog);
    }

    @Post('/blog')
    async storePost(@Body() blog: any, @Res() response: any, @Req() request: any, err: any,
        @UploadedFiles("thumbmails", {options: fileUploadOptions('blog')}) thumbmails: any) {
        const images: any = request.files;
        var imageBlog: Array<string> = [];
        blog.thumbmail = Object.keys(images).length ? images[0].path : null;
        for (let index = 1; index < Object.keys(images).length; index++) {
            imageBlog.push(images[index].path);
        }

        const storePost = await this.blogService.storePost(blog, imageBlog);

        return !storePost ? this.errorIntenal(response, 'Đã xảy ra lỗi') : this.created(response);
    }
}
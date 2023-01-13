import { Controller, Param, Body, Get, Post, Put, Delete, UseBefore, UseAfter, Res, Req } from 'routing-controllers';
import { checkJwt } from '../middlewares/checkJwt';
import { BaseController } from './BaseController';
import { User, Blog } from '../../models/index';
import { Container, Service } from 'typedi';
import { UserService } from '../services/UserService';
import { validate } from "class-validator";
import { Helper } from '../../ultils/Helper/Helper';
import { get } from 'http';
import { mainOptionsEmail } from '../../config/templateEmail';
import { sendNewEmail } from '../queues/sendMailQueue';

@Controller()
@UseBefore(checkJwt)
@Service()
export class UserController extends BaseController {
  private userService: UserService;
  private helper: Helper;
  constructor() {
    super();
    this.userService = new UserService();
    this.helper = new Helper();
  }
  @Get('/users')
  async getAll(@Res() response: any, @Req() request: any) {
    const listUsers: any = await this.userService.getListUser(request.query);

    return this.withData<any>(response, listUsers);
  }

  @Get('/users/:id')
  async getOne(@Param('id') id: number, @Res() response: any, @Req() request: any) {
    const userDetail: any =  await this.userService.userDetail(id);

    return !userDetail ? this.notFound(response) : this.withData<any>(response, userDetail);
  }

  @Post('/users')
  async post(@Body() user: any, @Res() response: any, @Req() request: any) {
    var userValidate: User = new User();
    userValidate.name = user.name;
    userValidate.email = user.email;
    userValidate.password = user.password;
    
    const errors = await validate(userValidate, {
      validationError: { target: false, value: false },
      skipMissingProperties: true,
    });

    if (Object.keys(errors).length) {
      let errorMessage: Array<String> = [];
      Object.keys(errors).forEach(function (key) {
        Object.keys(errors[key].constraints).forEach(function (index) {
          errorMessage.push(errors[key].constraints[index]);
        });
      });

      return this.errorValidate(response, errorMessage);
    }

    const createUser: any = await this.userService.storeUser(user);

    return !createUser ? this.errorIntenal(response, 'Đã xảy ra lỗi') : this.created(response);
  }

  @Put('/users/:id')
  put(@Param('id') id: number, @Body() user: any, @Res() response: any, @Req() request: any) {
    return 'Updating a user...';
  }

  @Delete('/users/:id')
  remove(@Param('id') id: number, @Res() response: any, @Req() request: any) {
    return 'Removing user...';
  }

  @Post('/user/send-mail')
  async sendMail(@Body() mail: string, @Req() request: any, @Res() response: any) {
    const sendMail: any = await sendNewEmail(mainOptionsEmail('kakitani2000@gmail.com', 'Namdv gửi mail test!'));

    return this.withData(response);
  }

}
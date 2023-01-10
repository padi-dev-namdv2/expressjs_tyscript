import { Controller, Param, Body, Get, Post, Put, Delete, UseBefore, Res, Req } from 'routing-controllers';
import { checkJwt } from '../middlewares/checkJwt';
import { BaseController } from './BaseController';
import { User, Blog } from '../../models/index';
import { Container, Service } from 'typedi';
import { UserService } from '../services/UserService';

@Controller()
@UseBefore(checkJwt)
@Service()
export class UserController extends BaseController {
  constructor(private userService: UserService ) {
    super();
  }
  @Get('/users')
  async getAll(@Res() response: any, @Req() request: any ) {
    const userServiceInstance = Container.get(UserController);
    var listUsers = await userServiceInstance.userService.getListUser(request.query);

    return this.withData<any>(response, listUsers);
  }

  @Get('/users/:id')
  getOne(@Param('id') id: number, @Res() response: any, @Req() request: any) {
    return 'This action returns user #' + id;
  }

  @Post('/users')
  post(@Body() user: any, @Res() response: any, @Req() request: any) {
    return 'Saving user...';
  }

  @Put('/users/:id')
  put(@Param('id') id: number, @Body() user: any, @Res() response: any, @Req() request: any) {
    return 'Updating a user...';
  }

  @Delete('/users/:id')
  remove(@Param('id') id: number, @Res() response: any, @Req() request: any) {
    return 'Removing user...';
  }
}
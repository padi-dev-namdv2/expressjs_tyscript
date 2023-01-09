import { Controller, Param, Body, Get, Post, Put, Delete, UseBefore, Res } from 'routing-controllers';
import { checkJwt } from '../middlewares/checkJwt';
import { BaseController } from './BaseController';
import { request } from 'http';

@Controller()
export class UserController extends BaseController {
  @Get('/users')
  getAll() {
    return 'test'
  }

  @Get('/users/:id')
  getOne(@Param('id') id: number) {
    return 'This action returns user #' + id;
  }

  @Post('/users')
  post(@Body() user: any) {
    return 'Saving user...';
  }

  @Put('/users/:id')
  put(@Param('id') id: number, @Body() user: any) {
    return 'Updating a user...';
  }

  @Delete('/users/:id')
  remove(@Param('id') id: number) {
    return 'Removing user...';
  }
}
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
import { BaseController } from "./BaseController";
import { Request, Response, response } from "express";
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";
import { User } from "../../models";
const bcrypt = require("bcrypt");
import config from "../../config";

@Controller()
export class AuthController extends BaseController {
  @Post("/login")
  async postLogin(@Body() user: any, @Res() response: any) {
    let userLogin: User = new User();
    userLogin.email = user.email;
    userLogin.password = user.password;

    const errors = await validate(userLogin, {
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

    var userFind: User = await User.findOne({
      where: {
        email: user.email,
      },
    });

    if (!userFind) {
      return this.notFound(response, "Email không tồn tại trên hệ thống!");
    }

    var checkPassword = await bcrypt.compare(user.password, userFind.password);

    if (!checkPassword) {
      return this.clientError(response, "Mật khẩu không chính xác");
    }

    const token = jwt.sign(
      //Create JWT, valid for 1 hour
      { id: userFind.id, name: userFind.name, email: userFind.email },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    return this.withData<any>(
      response,
      {
        profile: userFind,
        token: token,
      },
      "Đăng nhập thành công!"
    );
  }
}

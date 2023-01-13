import * as express from 'express'
import { CustomErrorHandler } from '../middlewares/customErrorHandler';
import { UseAfter, UseBefore } from 'routing-controllers';

@UseAfter(CustomErrorHandler)
export abstract class BaseController {

  /**
   * This is the implementation that we will leave to the
   * subclasses to figure out. 
   */

//   protected abstract executeImpl (
//     req: express.Request, res: express.Response
//   ): Promise<void | any>;

  /**
   * This is what we will call on the route handler.
   * We also make sure to catch any uncaught errors in the
   * implementation.
   */

//   public async execute (
//     req: express.Request, res: express.Response
//   ): Promise<void> {

//     try {
//       await this.executeImpl(req, res);
//     } catch (err) {
//       console.log(`[BaseController]: Uncaught controller error`);
//       console.log(err);
//       this.fail(res, 'An unexpected error occurred')
//     }
//   }

  public jsonResponse (res: express.Response, code: number, message: string, success: boolean) {
    return res.status(code).json({
      success: success,
      code: code,
      message: message
    })
  }

  public withData<T> (res: express.Response, dto?: T, message?: string) {
    if (!!dto) {
      res.type('application/json');
      return res.status(200).json({
        success: true,
        code: 200,
        data: dto,
        message: message ? message : 'Lấy dữ liệu thành công!'
      });
    } else {
      return res.status(200).json({
        success: true,
        code: 200,
        message: message ? message : 'Success!'
      });
    }
  }

  public errorValidate<T>(res: express.Response, dto?: T) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: dto,
    })
  }

  public created (res: express.Response, message?: string) {
    return this.jsonResponse(res, 201, message ? message : 'Creted Success!', false);
  }

  public clientError (res: express.Response, message?: string) {
    return this.jsonResponse(res, 400, message ? message : 'Unauthorized', false);
  }

  public unauthorized (res: express.Response, message?: string) {
    return this.jsonResponse(res, 401, message ? message : 'Unauthorized', false);
  }

  public paymentRequired (res: express.Response, message?: string) {
    return this.jsonResponse(res, 402, message ? message : 'Payment required', false);
  }

  public forbidden (res: express.Response, message?: string) {
    return this.jsonResponse(res, 403, message ? message : 'Forbidden', false);
  }

  public notFound (res: express.Response, message?: string) {
    return this.jsonResponse(res, 404, message ? message : 'Not found', false);
  }

  public conflict (res: express.Response, message?: string) {
    return this.jsonResponse(res, 409, message ? message : 'Conflict', false);
  }

  public tooMany (res: express.Response, message?: string) {
    return this.jsonResponse(res, 429, message ? message : 'Too many requests', false);
  }

  public todo (res: express.Response) {
    return this.jsonResponse(res, 400, 'TODO', false);
  }

  public errorIntenal (res: express.Response, error: Error | string) {
    return this.jsonResponse(res, 500, 'Error Intenal!', false);
  }
}
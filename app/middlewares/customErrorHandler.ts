import { ExpressErrorMiddlewareInterface, Middleware, HttpError } from 'routing-controllers';
import * as express from 'express';
import { Service } from 'typedi';

@Service()
@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  public error(error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) {
    const responseObject = {} as any;
    responseObject.success = false;

    if (error instanceof HttpError && error.httpCode) {  // Status code
      responseObject.status = error.httpCode;
      res.status(error.httpCode);
    } else {
      responseObject.status = 500;
      res.status(500);
    }

    responseObject.message = error.message;  // Message

    if (responseObject.status == 400) {  // Class validator handle errors
      let validatorErrors = {} as any;
      if (typeof error === 'object' && error.hasOwnProperty('errors')) {
        error.errors.forEach((element: any) => {
          if (element.property && element.constraints) {
            validatorErrors[element.property] = element.constraints;
          }
        });
      }
      responseObject.errors = validatorErrors;
    }

    if (error.stack && process.env.NODE_ENV === 'development' && responseObject.status == 500) {  // Append stack
      responseObject.stack = error.stack;
    }

    res.json(responseObject);  // Final response
  }
}

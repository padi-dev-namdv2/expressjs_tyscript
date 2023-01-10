import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../../config/index";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers["x-api-key"]; //Get the jwt token from the head
    let jwtPayload;

    try { //Try to validate the token and get data
        jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        res.status(401).send();
        return;
    }

    const { id, name, email } = jwtPayload;  //We want to send a new token on every request
    const newToken = jwt.sign({ id, name, email }, config.jwtSecret, {
        expiresIn: "1h"
    });
    res.setHeader("token", newToken);

    next();  //Call the next middleware or controller
};
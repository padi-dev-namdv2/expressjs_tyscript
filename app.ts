var express = require('express');
import { initDB } from "./connection";
const cors = require('cors');
const bodyParser = require('body-parser')
import helmet from "helmet";
const multer = require("multer");
const redis = require('redis');
const axios = require("axios");
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { UserController } from "./app/controller/UserController";
import { AuthController } from "./app/controller/AuthController";
import { BlogController } from "./app/controller/BlogController";
const nodemailer =  require('nodemailer');
import { transporter } from "./config/configMail";
import { redisConfig } from "./config/redisConfig";

export class App {
  private app;

  constructor() {
    this.app = express();
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(helmet());
    this.app.use(bodyParser.json());
    this.boostrap();
    const crateServer = createExpressServer(
        {
            controllers: [UserController, AuthController, BlogController],
        }
    );

    this.app.use(crateServer);
  }

  public start(): void {
    const port = process.env.PORT || 3000;

    this.app.listen(port, () => {
      console.log("Server listening on port: " + port);
      console.log("hello!");
    });
    this.app.get('/', (req: any, res: any) => {
        res.send("Hello Nam test!");
    })

    this.app.get('/test', async (req: any, res: any) => {
      try {
          const client = redis.createClient(redisConfig.dbPort);
          await client.connect();
          console.time('LOG_TIME');
          const value = await client.get('userId');
          //value is exists
          if(value) {
              console.timeEnd('LOG_TIME');
              return res.json({status: 200, message: 'OK'})
          }
          axios({
              method: 'GET',
              url: 'https://jsonplaceholder.typicode.com/todos/1',
          }).then(async response => {
              const {userId} = response.data;
              //send data to redis
              await client.set('userId', userId);
              console.timeEnd('LOG_TIME');
              return res.json(JSON.stringify(response.data));
          }).catch(async e => {
              console.log(e);
              return res.json({status: 500, message: 'error'});
          })
      } catch (e) {
          console.log(e);
          return res.status(500);
      }
  });
    
  }

  private async boostrap() {
    await initDB(); // Connect to db
  }
}
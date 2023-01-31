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
var session = require('express-session');
import { cronJob } from "./app/cronjobs/main";

export class App {
  private app;

  constructor() {
    this.app = express();
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(helmet());
    this.app.use(bodyParser.json());
    this.app.use(cronJob);
    this.app.use(session({
      resave: true, 
      saveUninitialized: true, 
      secret: 'somesecret', 
      cookie: { maxAge: 60000 }
    }));
    this.app.use("/public", express.static("public"));

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

    //test redis
    this.app.get('/test', async (req: any, res: any) => {
      try {
          const client = redis.createClient(redisConfig.dbPort);
          await client.connect();
          console.time('LOG_TIME');
          const value = await client.get('userId');

          if(value) { //value is exists
              console.timeEnd('LOG_TIME');
              return res.json({status: 200, message: 'OK'})
          }
          axios({
              method: 'GET',
              url: 'https://jsonplaceholder.typicode.com/todos/1',
          }).then(async response => {
              const {userId} = response.data;
              await client.set('userId', userId); //send data to redis
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

  this.app.get('/set_session', (req, res) => {
    //set a object to session
    req.session.User = {
        website: 'anonystick.com',
        type: 'blog javascript',
        like: '4550'
    }
    req.session.cookie.expires = new Date(Date.now() + 50000)

    return res.status(200).json({status: 'success'})
  })

  this.app.get('/get_session', (req, res) => {
    //check session
    if(req.session.User){
        return res.status(200).json({status: 'success', session: req.session.User})
    }
    return res.status(200).json({status: 'error', session: 'No session'})
})
    
  }

  private async boostrap() {
    await initDB(); // Connect to db
  }
}
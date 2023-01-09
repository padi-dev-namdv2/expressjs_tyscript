var express = require('express');
import { initDB } from "./connection";
const cors = require('cors');
const bodyParser = require('body-parser')
import helmet from "helmet";
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { UserController } from "./app/controller/UserController";

export class App {
  private app;

  constructor() {
    this.app = express();
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(helmet());
    this.app.use(bodyParser.json());
    this.boostrap();
    const crateServer = createExpressServer(
        {
            controllers: [UserController],
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
  }

  private async boostrap() {
    await initDB(); // Connect to db
  }
}
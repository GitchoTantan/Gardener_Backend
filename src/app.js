import express from 'express';
import cors from 'cors';
import morgan from "morgan";

import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import { options } from "./swaggerOptions";

import challengeRoutes from './routes/challenge';
import githubApiHandlerRoutes from './routes/githubApiHandler';
import mailRoutes from './routes/mail';

import { updateExpGroup } from './controllers/updateExp';

const cron = require("node-cron");

const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')

const specs = swaggerJSDoc(options)

const app = express();

const adminBro = new AdminBro({
    databases: [],
    rootPath: '/admin',
})

const router = AdminBroExpress.buildRouter(adminBro)

export const task = cron.schedule(
    "0 23 * * *",
    () => {
      updateExpGroup();
    },
    {
      scheduled: false,
    }
  );
  
task.start();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(challengeRoutes);
app.use(githubApiHandlerRoutes);
app.use(mailRoutes);

app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use(adminBro.options.rootPath, router);


export default app;
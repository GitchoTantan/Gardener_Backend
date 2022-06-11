import express from 'express';
import cors from 'cors';
import morgan from "morgan";

import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import { options } from "./swaggerOptions";

import challengeRoutes from './routes/challenge';
import githubApiHandlerRoutes from './routes/githubApiHandler';
import userRoutes from './routes/user';
import mailRoutes from './routes/mail';
import authRoute from './routes/auth';
//import { updateExpGroup } from './controllers/updateExp';

const cron = require("node-cron");

const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')

const specs = swaggerJSDoc(options)

const app = express();
const cookieSession = require("cookie-session");
const passport = require("passport");
require('./routes/passport');
const session = require('express-session');

app.use(cookieSession(
  {
      name:"session",
      keys:["gardener"],
      maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(session({
  secret: 'SECRET',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
const adminBro = new AdminBro({
  databases: [],
  rootPath: '/admin',
})

const router = AdminBroExpress.buildRouter(adminBro)

export const task = cron.schedule(
    "0 23 * * *",
    () => {
    //  updateExpGroup();
    }
  );

app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(authRoute);
app.use(morgan("dev"));
app.use(express.json());
app.use(challengeRoutes);
app.use(githubApiHandlerRoutes);
app.use(userRoutes);
app.use(mailRoutes);

app.use("/auth", authRoute);

app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use(adminBro.options.rootPath, router);


export default app;
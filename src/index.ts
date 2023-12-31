import express, { Express, Request, Response, json, urlencoded } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import env from './utils/env';
import { initMongoDB } from './utils/mongo';
import { SessionRouter } from './routers/session';
import { GroupRouter } from './routers/group';
import { LungRouter } from './routers/lung';
import { NotificationRouter } from './routers/notification';
import ErrorMiddleware from './middlewares/Error';
import AuthMiddleware from './middlewares/Auth';
import { initSentry } from './utils/sentry';
import './prototypes/string';

const port = env.port;
const app: Express = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));

initSentry(app);
initMongoDB();

const prefix = '/api';
app.use(`${prefix}/sessions`, SessionRouter);
app.use(`${prefix}/groups`, [AuthMiddleware], GroupRouter);
app.use(`${prefix}/notifications`, [AuthMiddleware], NotificationRouter);
app.use(`${prefix}/lungs`, [AuthMiddleware], LungRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world!');
});

app.use(ErrorMiddleware);

app.listen(port, () => {
    console.log(`🚀 ${env.environment} Server is running at http://localhost:${port}`);
});

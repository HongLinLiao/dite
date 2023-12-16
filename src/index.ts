import express, { Express, Request, Response, json, urlencoded } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import env from './utils/env';
import { initMongoDB } from './utils/mongo';
import AuthRouter from './routes/auth';
import GroupRouter from './routes/group';
import LungRouter from './routes/lung';
import NotifyRouter from './routes/notify';
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
app.use(`${prefix}/auth`, AuthRouter);
app.use(`${prefix}/group`, [AuthMiddleware], GroupRouter);
app.use(`${prefix}/notify`, [AuthMiddleware], NotifyRouter);
app.use(`${prefix}/lung`, [AuthMiddleware], LungRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world!');
});

app.use(ErrorMiddleware);

app.listen(port, () => {
    console.log(`🚀 ${env.environment} Server is running at http://localhost:${port}`);
});

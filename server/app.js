import 'babel-polyfill';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import apiRoutes from './apiRoutes';
import db from './models';
import { updateEventStatus, failureResponse } from './commonHelpers';
import formatInputDatas from './middlewares/formatInputDatas';

const app = express();

app.use('/api-docs', express.static(path.join(__dirname, '..', 'public', 'api-docs')));

const { Event } = db;
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(formatInputDatas);

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use('/api/v1', apiRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use((req, res) => failureResponse(res, 'page not found', {}, 404));

app.set('port', process.env.PORT || 3000);

// After starting the app, updateEventStatus is executed and also set to run everyday.
/* eslint-disable no-console */
app.listen(app.get('port'), () => {
  console.log(`App started on port ${app.get('port')}`);
  updateEventStatus(Event);
  const interval = 24 * 60 * 60 * 1000; // One day
  setInterval(() => {
    updateEventStatus(Event);
  }, interval);
});

export default app;

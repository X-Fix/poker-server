/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express';
import { Socket } from 'socket.io';
import compression from 'compression';
import { get, post } from './routes';
import { Route } from './definitions';

const app = express();
const port = process.env.PORT || 3000;
app.set('port', port);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const http = require('http').Server(app);
// set up socket.io and bind it to our
// http server.
const io = require('socket.io')(http);

get.forEach(({ handler, url }: Route) => app.get(url, handler));
post.forEach(({ handler, url }: Route) => app.post(url, handler));

io.on('connection', (socket: Socket) => {
  console.log('User connected', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

export default http;

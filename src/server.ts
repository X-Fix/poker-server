/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express';
import { Socket } from 'socket.io';
import compression from 'compression';
import cors from 'cors';
import { get, messages, post } from './endpoints';
import { Route } from './definitions';

const app = express();
const port = process.env.PORT || 3000;
app.set('port', port);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

get.forEach(({ handler, url }: Route) => app.get(url, cors(), handler));
post.forEach(({ handler, url }: Route) => app.post(url, cors(), handler));

const http = require('http').Server(app);
const io = require('socket.io')(http, { cors: '*' });

io.on('connection', (socket: Socket) => {
  console.log('User connected', socket.conn.id, socket.id);

  messages.forEach(({ handler, message }) => {
    socket.on(message, (payload, cb) => {
      handler(payload, socket, io.of('/'), cb);
    });
  });

  socket.on('reconnect', () => {
    console.log('User reconnect');
  });
});

export default http;

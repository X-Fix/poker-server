import home from './home';
import ping from './ping';
import createSession from './createSession';
import joinSession from './joinSession';
import { resetRoute } from './debug';

export const get = [home, ping];
export const post = [createSession, joinSession, resetRoute];

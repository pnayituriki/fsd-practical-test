import pino from 'pino';
import { isDev } from '../config/env';

export const logger = pino(
  isDev
    ? { transport: { target: 'pino-pretty', options: { singleLine: true } } }
    : {}
);

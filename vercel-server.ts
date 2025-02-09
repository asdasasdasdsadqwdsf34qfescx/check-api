import { createServer, IncomingMessage, ServerResponse } from 'http';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './src/app.module';
import * as express from 'express';

let cachedServer: any;

async function bootstrapServer() {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter);
  app.enableCors(); // Enable CORS if required
  await app.init();
  return expressApp;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  const server = createServer(cachedServer);
  server.emit('request', req, res);
}

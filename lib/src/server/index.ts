// import metadata for es7 decorators support
import 'reflect-metadata';

// allow creation of aliases for directories
import 'module-alias/register';

import http from 'http';
import env from '../common/config/env';
import { Server } from './server';

const server = new Server();

const httpServer = http.createServer(server.getServer().build());

httpServer.listen(env.port);

httpServer.on('listening', () => console.log('🚀 listening on ' + env.port));

server.db.once('open', () => console.log('🤖 MongoDB Connected!'));

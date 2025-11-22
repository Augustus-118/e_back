import { createServer } from 'http';
import { app } from './app';
import { setupSocket } from './socket';
import { config } from './config';

const httpServer = createServer(app);

setupSocket(httpServer);

httpServer.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});

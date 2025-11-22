import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { aggregatorService } from './services/aggregator';

export const setupSocket = (httpServer: HttpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    // Periodic updates (simulating real-time data push)
    setInterval(async () => {
        try {
            const data = await aggregatorService.getAggregatedData('SOL');
            io.emit('price-update', data);
        } catch (error) {
            console.error('Error pushing updates:', error);
        }
    }, 10000); // Update every 10 seconds

    return io;
};

import express from 'express';
import cors from 'cors';
import { aggregatorService } from './services/aggregator';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/tokens', async (req, res) => {
    try {
        const query = (req.query.q as string) || 'SOL'; // Default search
        console.log(`API received query: ${query}`);
        const data = await aggregatorService.getAggregatedData(query);
        res.json(data);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export { app };

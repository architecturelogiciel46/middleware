import express from 'express';
import cors from 'cors';
const app = express();
import { createProxyMiddleware } from 'http-proxy-middleware';
import 'dotenv/config';

app.use(cors());
app.use(express.json());

const productsProxy = createProxyMiddleware({
    target: process.env.PRODUCTS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/products': '/products'
    },
    onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).json({ error: 'Proxy error' });
    },
});

const searchProxy = createProxyMiddleware({
  target: process.env.SEARCH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/search': '/search' },
  onError: (err, req, res) => {
    console.error('Search proxy error:', err);
    res.status(500).json({ error: 'Search proxy error' });
  },
});

app.get('/', (req, res) => { 
    res.send('Welcome to the Gateway API');
});

app.get('/api/products', productsProxy);
app.get('/api/search', searchProxy);

app.listen(process.env.PORT || 4000, () => {
    console.log(`Gateway API is running on port ${process.env.PORT || 4000}`);
});
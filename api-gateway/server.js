const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

// Configure CORS
app.use(cors({
  origin: [
    'https://finspeed.online',
    'https://www.finspeed.online',
    'https://staging.finspeed.online',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Proxy-Authorization', 'X-App-Authorization', 'X-Requested-With'],
  credentials: true
}));

// Middleware for parsing JSON and raw body
app.use(express.json());
app.use(express.raw({ type: '*/*', limit: '10mb' }));

// API Gateway route handler
app.all('*', async (req, res) => {
  try {
    const apiBaseUrl = process.env.API_BASE_URL;
    
    if (!apiBaseUrl) {
      return res.status(500).json({ error: 'API_BASE_URL not configured' });
    }

    // Forward the request to the private Cloud Run API
    const targetUrl = `${apiBaseUrl}${req.path}`;

    // Normalize auth headers: Cloud Run/IAP expects Authorization; accept Proxy-Authorization from clients
    const incomingAuth = req.headers['authorization'];
    const incomingProxyAuth = req.headers['proxy-authorization'];
    const downstreamAuth = incomingAuth || incomingProxyAuth;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'User-Agent': 'Finspeed-API-Gateway/1.0',
        // Forward Authorization to backend; if absent, map Proxy-Authorization -> Authorization for IAP
        ...(downstreamAuth && { 'Authorization': downstreamAuth }),
        // Also forward Proxy-Authorization as-is for visibility if needed
        ...(incomingProxyAuth && { 'Proxy-Authorization': incomingProxyAuth }),
        // Forward app JWT header if client uses a separate header to avoid conflicts with IAP
        ...(req.headers['x-app-authorization'] && { 'X-App-Authorization': req.headers['x-app-authorization'] })
      },
      // Use body for non-GET/HEAD requests
      ...(req.method !== 'GET' && req.method !== 'HEAD' && {
        body: req.body && req.body.length ? req.body : (req.body ? JSON.stringify(req.body) : undefined)
      })
    });

    // Forward response headers
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      // Skip headers that shouldn't be forwarded
      if (!['content-encoding', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) {
        responseHeaders[key] = value;
      }
    });

    // Set response headers
    Object.entries(responseHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Forward status and body
    res.status(response.status);
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const jsonData = await response.json();
      res.json(jsonData);
    } else {
      const textData = await response.text();
      res.send(textData);
    }

  } catch (error) {
    console.error('API Gateway Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/_health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`API Gateway server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`API Base URL: ${process.env.API_BASE_URL}`);
});

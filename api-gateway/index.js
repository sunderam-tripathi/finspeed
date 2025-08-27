const functions = require('@google-cloud/functions-framework');
const cors = require('cors');

// Configure CORS
const corsHandler = cors({
  origin: [
    'https://finspeed.online',
    'https://www.finspeed.online',
    'https://staging.finspeed.online',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Proxy-Authorization', 'X-App-Authorization', 'X-Requested-With'],
  credentials: true
});

// API Gateway function
functions.http('apiGateway', async (req, res) => {
  // Handle CORS
  corsHandler(req, res, async () => {
    try {
      const apiBaseUrl = process.env.API_BASE_URL;
      
      if (!apiBaseUrl) {
        return res.status(500).json({ error: 'API_BASE_URL not configured' });
      }

      // Forward the request to the private Cloud Run API
      // Strip /api-gateway prefix from the path before forwarding
      const cleanPath = req.path.replace(/^\/api-gateway/, '');
      const targetUrl = `${apiBaseUrl}${cleanPath}`;
  
      // Normalize auth headers: Cloud Run/IAP expects Authorization; accept Proxy-Authorization from clients
      const incomingAuth = req.headers['authorization']
      const incomingProxyAuth = req.headers['proxy-authorization']
      const downstreamAuth = incomingAuth || incomingProxyAuth

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
        // Use rawBody when available to preserve binary/form-data payloads
        ...(req.method !== 'GET' && req.method !== 'HEAD' && {
          body: req.rawBody && req.rawBody.length ? req.rawBody : (req.body ? JSON.stringify(req.body) : undefined)
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
});

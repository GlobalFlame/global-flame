const express = require('express');
const path    = require('path');
const app     = express();
const port    = process.env.PORT || 3000;

// Serve static files from public/
app.use(express.static(path.join(__dirname, '..', 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is alive on port 3000!' });
});

// Fallback to index.html for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log('Server listening at http://localhost:' + port);
});

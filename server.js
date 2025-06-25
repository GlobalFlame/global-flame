const express = require("express");
const app = express();

// Root route
app.get("/", (req, res) => {
  res.send("<h1>🔥 Global Flame Server Alive!</h1><p>No overlays, just flame.</p>");
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

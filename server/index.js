import express from 'express';
import path from 'path';

const port = 3000;
const __dirname = path.resolve("public");
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, '../public')));

console.log('dirname', __dirname);

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Basic routes
app.get('/home', (req, res) => {
  res.send('Welcome to the Express server!');
});

// Example API endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Handle 404 - Keep this as the last route
//app.use((req, res) => {
 // res.status(404).send('Sorry, page not found!');
//});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
import express from 'express';
import path from 'path';

const port = 3000;
const __dirname = path.resolve(); // Correctly resolves the current directory
const app = express();

app.use(express.static(path.join(__dirname, '../public')));



// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

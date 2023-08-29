import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { env } from 'process'; // Import the env property from the process module

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = createServer(async (req, res) => {
  const filePath = join(__dirname, 'build', req.url === '/' ? 'index.html' : req.url);

  try {
    const data = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('404 - Not Found');
  }
});

const PORT = env.PORT || 3000; // Use env property from the process module
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

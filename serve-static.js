const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(process.cwd(), 'out');

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

function resolveRequest(urlPath) {
  const cleanPath = decodeURIComponent((urlPath || '/').split('?')[0]);
  const normalizedPath = cleanPath === '/' ? '/index.html' : cleanPath;

  const candidates = [normalizedPath];
  if (!path.extname(normalizedPath)) {
    candidates.push(`${normalizedPath}.html`);
    candidates.push(path.posix.join(normalizedPath, 'index.html'));
  }

  for (const candidate of candidates) {
    const resolvedCandidate = path.normalize(path.join(root, candidate));
    if (!resolvedCandidate.startsWith(root)) {
      continue;
    }

    try {
      const stat = fs.statSync(resolvedCandidate);
      if (stat.isFile()) {
        return candidate;
      }
      if (stat.isDirectory()) {
        const indexCandidate = path.normalize(path.join(resolvedCandidate, 'index.html'));
        if (indexCandidate.startsWith(root) && fs.existsSync(indexCandidate)) {
          return path.join(candidate, 'index.html');
        }
      }
    } catch {
      // Try the next candidate.
    }
  }

  return normalizedPath;
}

const server = http.createServer((req, res) => {
  const relativePath = resolveRequest(req.url);
  const filePath = path.normalize(path.join(root, relativePath));

  if (!filePath.startsWith(root)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    const finalPath = stat.isDirectory() ? path.join(filePath, 'index.html') : filePath;
    fs.readFile(finalPath, (readErr, data) => {
      if (readErr) {
        res.statusCode = 500;
        res.end('Server error');
        return;
      }

      const ext = path.extname(finalPath).toLowerCase();
      res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
      res.end(data);
    });
  });
});

server.listen(4028, '127.0.0.1', () => {
  console.log('Static server ready on http://localhost:4028');
});

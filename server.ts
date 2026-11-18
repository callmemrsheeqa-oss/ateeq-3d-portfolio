import 'dotenv/config';
import cookieParser from 'cookie-parser';
import express, { type NextFunction, type Request, type Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { apiRouter as contactRouter } from './server/routes/contact.ts';
import { publicRouter } from './server/routes/public.ts';
import { aiRouter } from './server/routes/ai.ts';
import { adminRouter } from './server/routes/admin.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.set('trust proxy', 1);
  app.use(cookieParser());
  app.use(express.json({ limit: '64kb' }));

  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  app.use('/api', contactRouter);
  app.use('/api', publicRouter);
  app.use('/api/ai', aiRouter);
  app.use('/api/admin', adminRouter);

  // Global error handler (including Multer upload validation errors)
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled API error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error.';
    const status = message.includes('Only ') || message.includes('File too large') ? 400 : 500;
    res.status(status).json({ ok: false, error: message });
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    const publicPath = path.resolve(__dirname, 'public');

    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath, { index: false }));
    } else if (fs.existsSync(publicPath)) {
      app.use(express.static(publicPath, { index: false }));
    }

    app.get('/{*splat}', (_req, res) => {
      const indexFile = path.resolve(distPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

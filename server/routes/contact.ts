import { Router } from 'express';
import { getHealth, postContact } from '../controllers/contactController.ts';
import { contactRateLimiter, healthRateLimiter } from '../middleware/rateLimit.ts';

export const apiRouter = Router();

apiRouter.get('/health', healthRateLimiter, getHealth);
apiRouter.post('/contact', contactRateLimiter, postContact);

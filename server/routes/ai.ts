import { Router } from 'express';
import { postAiChat } from '../controllers/aiController.ts';
import { aiRateLimiter } from '../middleware/rateLimit.ts';

export const aiRouter = Router();

aiRouter.post('/chat', aiRateLimiter, postAiChat);

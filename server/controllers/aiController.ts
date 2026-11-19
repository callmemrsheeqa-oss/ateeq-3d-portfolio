import type { Request, Response } from 'express';
import {
  askMuavinAi,
  MuavinConfigError,
  MuavinDisabledError,
  MuavinTimeoutError,
  MuavinUpstreamError,
  type ChatTurn,
} from '../services/muavinService.ts';

export async function postAiChat(req: Request, res: Response): Promise<void> {
  const body = req.body as Record<string, unknown> | undefined;
  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  if (message.length < 1 || message.length > 800) {
    res.status(400).json({
      ok: false,
      code: 'VALIDATION_ERROR',
      error: 'Please enter a message between 1 and 800 characters.',
    });
    return;
  }

  const rawHistory = Array.isArray(body?.history) ? body.history : [];
  const history: ChatTurn[] = rawHistory
    .slice(-8)
    .filter(
      (item): item is { role: 'user' | 'assistant'; content: string } =>
        Boolean(item) &&
        typeof item === 'object' &&
        (item.role === 'user' || item.role === 'assistant') &&
        typeof item.content === 'string' &&
        item.content.trim().length > 0,
    )
    .map((item) => ({
      role: item.role,
      content: item.content.trim().slice(0, 1200),
    }));

  try {
    const result = await askMuavinAi(message, history);
    res.status(200).json({
      ok: true,
      reply: result.reply,
      model: result.model,
    });
  } catch (error) {
    if (error instanceof MuavinDisabledError) {
      res.status(503).json({
        ok: false,
        code: 'MUAVIN_DISABLED',
        error: error.message,
      });
      return;
    }

    if (error instanceof MuavinConfigError) {
      res.status(500).json({
        ok: false,
        code: 'MUAVIN_WORKER_MISCONFIGURED',
        error: error.message,
      });
      return;
    }

    if (error instanceof MuavinTimeoutError) {
      res.status(504).json({
        ok: false,
        code: 'AI_TIMEOUT',
        error: 'Muavin AI took too long to respond. Please try a shorter question.',
      });
      return;
    }

    if (error instanceof MuavinUpstreamError) {
      console.error('Muavin Worker upstream error:', error.statusCode, error.message);

      if (error.statusCode === 429) {
        res.status(429).json({
          ok: false,
          code: 'RATE_LIMITED',
          error: 'Muavin AI is busy right now. Please try again in a moment.',
        });
        return;
      }

      if (error.statusCode === 503) {
        res.status(503).json({
          ok: false,
          code: 'AI_HIGH_DEMAND',
          error: 'Muavin AI is experiencing temporary high demand upstream. Please try again in a moment.',
        });
        return;
      }

      res.status(error.statusCode >= 500 ? 502 : 400).json({
        ok: false,
        code: 'AI_UPSTREAM_ERROR',
        error: error.message || 'Muavin AI could not complete your request right now. Please try again.',
      });
      return;
    }

    console.error('Muavin AI unexpected error:', error);
    res.status(502).json({
      ok: false,
      code: 'AI_UPSTREAM_ERROR',
      error: 'Muavin AI could not complete your request right now. Please try again.',
    });
  }
}

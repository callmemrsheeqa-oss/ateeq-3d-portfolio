import type { Request, Response } from 'express';
import {
  askMuavinAi,
  MuavinDisabledError,
  MuavinMissingKeyError,
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

    if (error instanceof MuavinMissingKeyError) {
      res.status(503).json({
        ok: false,
        code: 'GEMINI_NOT_CONFIGURED',
        error:
          'Muavin AI requires GEMINI_API_KEY to be configured in Settings > Secrets on the server.',
      });
      return;
    }

    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('Muavin AI error:', error);

    if (errMsg.includes('MUAVIN_TIMEOUT')) {
      res.status(504).json({
        ok: false,
        code: 'AI_TIMEOUT',
        error: 'Muavin AI took too long to respond. Please try a shorter question.',
      });
      return;
    }

    if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
      res.status(429).json({
        ok: false,
        code: 'QUOTA_EXCEEDED',
        error: 'Gemini API rate limit or quota reached. Please try again shortly.',
      });
      return;
    }

    if (
      errMsg.includes('API_KEY_INVALID') ||
      errMsg.includes('PERMISSION_DENIED') ||
      errMsg.includes('API key not valid') ||
      errMsg.includes('403')
    ) {
      res.status(503).json({
        ok: false,
        code: 'GEMINI_KEY_INVALID',
        error:
          'Muavin AI could not authenticate with Gemini. Please verify GEMINI_API_KEY in Settings > Secrets.',
      });
      return;
    }

    if (errMsg.includes('NOT_FOUND') || errMsg.includes('404')) {
      res.status(502).json({
        ok: false,
        code: 'MODEL_NOT_FOUND',
        error: 'Configured Gemini model was not found upstream. Check GEMINI_MODEL configuration.',
      });
      return;
    }

    if (errMsg.includes('503') || errMsg.includes('UNAVAILABLE')) {
      res.status(503).json({
        ok: false,
        code: 'AI_HIGH_DEMAND',
        error: 'Muavin AI is experiencing temporary high demand upstream. Please try again in a moment.',
      });
      return;
    }

    res.status(502).json({
      ok: false,
      code: 'AI_UPSTREAM_ERROR',
      error: 'Muavin AI could not complete your request right now. Please try again.',
    });
  }
}

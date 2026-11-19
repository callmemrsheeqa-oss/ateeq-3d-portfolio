import type { IncomingMessage, ServerResponse } from 'node:http';

const DEFAULT_MUAVIN_WORKER_URL = 'https://muavin.callmemrsheeqa.workers.dev';
const WORKER_TIMEOUT_MS = 16000;
const MAX_BODY_BYTES = 64 * 1024;

interface WorkerChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface VercelIncomingMessage extends IncomingMessage {
  body?: unknown;
}

function sendJson(res: ServerResponse, statusCode: number, payload: Record<string, unknown>): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

function resolveWorkerUrl(): string {
  const configured = process.env.MUAVIN_WORKER_URL?.trim();
  const raw = configured && configured.length > 0 ? configured : DEFAULT_MUAVIN_WORKER_URL;
  const normalized = raw.replace(/\/+$/, '');
  const parsed = new URL(normalized);
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('MUAVIN_WORKER_URL must use http or https protocol.');
  }
  return normalized;
}

async function readRequestBody(req: VercelIncomingMessage): Promise<Record<string, unknown> | null> {
  if (req.body !== undefined) {
    if (typeof req.body === 'string') {
      return JSON.parse(req.body) as Record<string, unknown>;
    }
    if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
      return req.body as Record<string, unknown>;
    }
  }

  const chunks: Buffer[] = [];
  let totalBytes = 0;

  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));
    totalBytes += buf.length;
    if (totalBytes > MAX_BODY_BYTES) {
      throw new Error('BODY_TOO_LARGE');
    }
    chunks.push(buf);
  }

  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
}

async function callWorkerOnce(
  workerUrl: string,
  messages: WorkerChatMessage[],
): Promise<{ ok: true; reply: string } | { ok: false; status: number; message: string; retryable: boolean }> {
  let response: Response;
  try {
    response = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ messages }),
      signal: AbortSignal.timeout(WORKER_TIMEOUT_MS),
    });
  } catch (err) {
    const isTimeout =
      err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError');
    return {
      ok: false,
      status: isTimeout ? 504 : 502,
      message: isTimeout
        ? 'Muavin AI took too long to respond. Please try again.'
        : 'Unable to reach Muavin AI service right now.',
      retryable: true,
    };
  }

  const rawText = await response.text();
  let parsed: Record<string, unknown> | null = null;
  if (rawText) {
    try {
      const candidate = JSON.parse(rawText);
      if (candidate && typeof candidate === 'object') {
        parsed = candidate as Record<string, unknown>;
      }
    } catch {
      parsed = null;
    }
  }

  if (!response.ok) {
    const upstreamErr =
      (typeof parsed?.details === 'string' && parsed.details.trim()) ||
      (typeof parsed?.error === 'string' && parsed.error.trim()) ||
      `Muavin worker returned HTTP ${response.status}.`;
    const retryable = response.status >= 500 || response.status === 429;
    return {
      ok: false,
      status: response.status,
      message: upstreamErr,
      retryable,
    };
  }

  const reply = typeof parsed?.reply === 'string' ? parsed.reply.trim() : '';
  if (!reply) {
    return {
      ok: false,
      status: 502,
      message: 'Muavin AI returned an invalid or empty response.',
      retryable: false,
    };
  }

  return { ok: true, reply };
}

export default async function handler(req: VercelIncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, {
      ok: false,
      code: 'METHOD_NOT_ALLOWED',
      error: 'Method not allowed. Use POST.',
    });
    return;
  }

  let body: Record<string, unknown> | null = null;
  try {
    body = await readRequestBody(req);
  } catch (err) {
    if (err instanceof Error && err.message === 'BODY_TOO_LARGE') {
      sendJson(res, 413, {
        ok: false,
        code: 'PAYLOAD_TOO_LARGE',
        error: 'Request payload is too large.',
      });
      return;
    }
    sendJson(res, 400, {
      ok: false,
      code: 'INVALID_JSON',
      error: 'Invalid JSON request body.',
    });
    return;
  }

  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  if (message.length < 1 || message.length > 800) {
    sendJson(res, 400, {
      ok: false,
      code: 'VALIDATION_ERROR',
      error: 'Please enter a message between 1 and 800 characters.',
    });
    return;
  }

  const rawHistory = Array.isArray(body?.history) ? body.history : [];
  const workerMessages: WorkerChatMessage[] = rawHistory
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
      text: item.content.trim().slice(0, 1200),
    }));

  workerMessages.push({ role: 'user', text: message });

  let workerUrl: string;
  try {
    workerUrl = resolveWorkerUrl();
  } catch {
    sendJson(res, 500, {
      ok: false,
      code: 'MUAVIN_WORKER_MISCONFIGURED',
      error: 'MUAVIN_WORKER_URL is invalid on the server.',
    });
    return;
  }

  let result = await callWorkerOnce(workerUrl, workerMessages);
  if (!result.ok && result.retryable) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    result = await callWorkerOnce(workerUrl, workerMessages);
  }

  if (result.ok) {
    sendJson(res, 200, {
      ok: true,
      reply: result.reply,
      model: 'muavin-cloudflare-worker',
    });
    return;
  }

  if (result.status === 429) {
    sendJson(res, 429, {
      ok: false,
      code: 'RATE_LIMITED',
      error: 'Muavin AI is busy right now. Please try again in a moment.',
    });
    return;
  }

  if (result.status === 504) {
    sendJson(res, 504, {
      ok: false,
      code: 'AI_TIMEOUT',
      error: 'Muavin AI took too long to respond. Please try a shorter question.',
    });
    return;
  }

  sendJson(res, result.status >= 500 ? 502 : 400, {
    ok: false,
    code: 'AI_UPSTREAM_ERROR',
    error: result.message || 'Muavin AI could not complete your request right now. Please try again.',
  });
}

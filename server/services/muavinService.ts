import { eq } from 'drizzle-orm';
import { db } from '../../src/db/index.ts';
import { siteSettings } from '../../src/db/schema.ts';

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

interface WorkerChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export class MuavinDisabledError extends Error {
  constructor() {
    super('Muavin AI is currently disabled by the portfolio administrator.');
    this.name = 'MuavinDisabledError';
  }
}

export class MuavinConfigError extends Error {
  constructor(message = 'MUAVIN_WORKER_URL is invalid on the backend server.') {
    super(message);
    this.name = 'MuavinConfigError';
  }
}

export class MuavinTimeoutError extends Error {
  constructor() {
    super('MUAVIN_TIMEOUT');
    this.name = 'MuavinTimeoutError';
  }
}

export class MuavinUpstreamError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 502) {
    super(message);
    this.name = 'MuavinUpstreamError';
    this.statusCode = statusCode;
  }
}

const DEFAULT_MUAVIN_WORKER_URL = 'https://muavin.callmemrsheeqa.workers.dev';
const WORKER_TIMEOUT_MS = 16000;

export function resolveMuavinWorkerUrl(): string {
  const configured = process.env.MUAVIN_WORKER_URL?.trim();
  const raw = configured && configured.length > 0 ? configured : DEFAULT_MUAVIN_WORKER_URL;
  const normalized = raw.replace(/\/+$/, '');

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new MuavinConfigError('MUAVIN_WORKER_URL must be a valid HTTP or HTTPS URL.');
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new MuavinConfigError('MUAVIN_WORKER_URL must use http or https protocol.');
  }

  return normalized;
}

async function isMuavinEnabledInDb(): Promise<boolean> {
  if (!process.env.SQL_HOST) {
    return true;
  }
  try {
    const rows = await db
      .select({ muavinEnabled: siteSettings.muavinEnabled })
      .from(siteSettings)
      .where(eq(siteSettings.id, 1))
      .limit(1);
    if (rows.length > 0) {
      return rows[0].muavinEnabled;
    }
    return true;
  } catch (err) {
    // Do not block Muavin if DB is temporarily unreachable
    console.warn('Could not read muavinEnabled setting from database; defaulting to enabled:', err);
    return true;
  }
}

async function invokeMuavinWorkerOnce(
  workerUrl: string,
  messages: WorkerChatMessage[],
): Promise<{ reply: string; model: string }> {
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
    if (err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError')) {
      throw new MuavinTimeoutError();
    }
    throw new MuavinUpstreamError('Unable to reach the Muavin Cloudflare Worker.', 502);
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
    const upstreamMessage =
      (typeof parsed?.details === 'string' && parsed.details.trim()) ||
      (typeof parsed?.error === 'string' && parsed.error.trim()) ||
      `Muavin worker returned HTTP ${response.status}.`;
    throw new MuavinUpstreamError(upstreamMessage, response.status);
  }

  const reply = typeof parsed?.reply === 'string' ? parsed.reply.trim() : '';
  if (!reply) {
    throw new MuavinUpstreamError('Muavin worker returned an empty or invalid reply.', 502);
  }

  return {
    reply,
    model: 'muavin-cloudflare-worker',
  };
}

export async function askMuavinAi(
  userMessage: string,
  history: ChatTurn[],
): Promise<{ reply: string; model: string }> {
  const enabled = await isMuavinEnabledInDb();
  if (!enabled) {
    throw new MuavinDisabledError();
  }

  const workerUrl = resolveMuavinWorkerUrl();

  const workerMessages: WorkerChatMessage[] = [
    ...history.slice(-8).map((turn) => ({
      role: turn.role === 'assistant' ? ('assistant' as const) : ('user' as const),
      text: turn.content.slice(0, 1200),
    })),
    {
      role: 'user',
      text: userMessage,
    },
  ];

  try {
    return await invokeMuavinWorkerOnce(workerUrl, workerMessages);
  } catch (err) {
    const shouldRetry =
      err instanceof MuavinTimeoutError ||
      (err instanceof MuavinUpstreamError &&
        (err.statusCode >= 500 || err.statusCode === 429));

    if (shouldRetry) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return await invokeMuavinWorkerOnce(workerUrl, workerMessages);
    }
    throw err;
  }
}

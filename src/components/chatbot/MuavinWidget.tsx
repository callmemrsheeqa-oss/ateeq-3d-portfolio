import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Loader2, MessageSquare, RotateCcw, Send, Sparkles, X } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { DEFAULT_MUAVIN_SUGGESTIONS } from '../../data/profile';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function MuavinWidget() {
  const { portfolio } = usePortfolio();
  const { settings } = portfolio;
  const { reducedMotion } = useDeviceCapabilities();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content: settings.muavinWelcomeMessage,
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestedQuestions =
    Array.isArray(settings.muavinSuggestedQuestions) && settings.muavinSuggestedQuestions.length > 0
      ? settings.muavinSuggestedQuestions
      : DEFAULT_MUAVIN_SUGGESTIONS;

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [{ id: 'welcome', role: 'assistant', content: settings.muavinWelcomeMessage }];
      }
      return prev;
    });
  }, [settings.muavinWelcomeMessage]);

  useEffect(() => {
    if (open) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      window.setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open, messages, sending]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  if (!settings.muavinEnabled) {
    return null;
  }

  const sendMessage = async (textOverride?: string) => {
    const trimmed = (textOverride ?? input).trim();
    if (!trimmed || sending) return;

    setErrorMsg(null);
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    const historyForApi = messages
      .filter((m) => m.id !== 'welcome')
      .slice(-8)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMsg]);
    if (!textOverride) setInput('');
    setSending(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          history: historyForApi,
        }),
      });

      const rawText = await res.text();
      let data: { ok?: boolean; reply?: unknown; error?: unknown } = {};
      if (rawText) {
        try {
          const parsed = JSON.parse(rawText);
          if (parsed && typeof parsed === 'object') {
            data = parsed as { ok?: boolean; reply?: unknown; error?: unknown };
          }
        } catch {
          data = {};
        }
      }

      const replyText = typeof data.reply === 'string' ? data.reply.trim() : '';
      if (res.ok && replyText.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: replyText,
          },
        ]);
      } else {
        const errText = typeof data.error === 'string' && data.error.trim() ? data.error.trim() : '';
        setErrorMsg(
          errText || 'Muavin AI could not answer right now. Please try again shortly.',
        );
      }
    } catch {
      setErrorMsg('Network error reaching Muavin AI. Please check your connection.');
    } finally {
      setSending(false);
    }
  };

  const handleClear = () => {
    setErrorMsg(null);
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: settings.muavinWelcomeMessage,
      },
    ]);
  };

  return (
    <div className="no-print fixed bottom-5 right-5 z-40 flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-label="Muavin AI Assistant"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 flex h-[min(570px,calc(100vh-6rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[var(--border-accent)] bg-[var(--bg-base)] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border-accent)] bg-[var(--accent-primary)]/15 text-[var(--accent-ink)]">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate font-display text-sm font-semibold text-[var(--text-primary)]">
                    Muavin AI
                  </h2>
                  <p className="truncate font-mono text-[10px] text-[var(--text-secondary)]">
                    Portfolio Assistant · English
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleClear}
                  title="Clear conversation"
                  aria-label="Clear chat"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-accent)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Minimize Muavin AI"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-accent)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-[var(--accent-primary)] text-[var(--accent-on-primary)] font-medium'
                          : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)]'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}

              {sending && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-xs text-[var(--accent-ink)]">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="rounded-xl border border-rose-500/35 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-600 dark:text-rose-200">
                  {errorMsg}
                </div>
              )}
            </div>

            {/* Persistent Suggested Questions Bar (always visible & scrollable, preserves history) */}
            <div
              aria-label="Quick suggested questions"
              className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/75 px-3 py-2"
            >
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                Quick Questions
              </p>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    disabled={sending}
                    onClick={() => sendMessage(q)}
                    className="shrink-0 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-base)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-secondary)] hover:border-[var(--border-accent)] hover:text-[var(--accent-ink)] disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={800}
                placeholder="Ask a question about Ateeq’s portfolio..."
                className="flex-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-secondary)]/65 focus:border-[var(--accent-ink)] focus:outline-none"
              />
              <button
                type="submit"
                disabled={sending || input.trim().length === 0}
                aria-label="Send message to Muavin AI"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-primary)] text-[var(--accent-on-primary)] hover:bg-[var(--accent-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Launcher Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? 'Close Muavin AI assistant' : 'Open Muavin AI assistant'}
        className="inline-flex items-center gap-2.5 rounded-full border border-[var(--border-accent)] bg-[var(--bg-surface)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] shadow-[0_12px_32px_var(--glow-primary)] hover:border-[var(--accent-ink)] transition-colors cursor-pointer"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-primary)] text-[var(--accent-on-primary)]">
          {open ? (
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </span>
        <span className="font-display">Muavin AI</span>
      </button>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Loader2, MessageSquare, RotateCcw, Send, Sparkles, X } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "What is Ateeq's educational background?",
  'Tell me about his Finite Group Theory and AI projects.',
  'What is his mathematics teaching experience?',
  'How can I contact Ateeq or download his CV?',
];

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

  const showSuggestions = messages.length <= 1 && !sending;

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
            className="mb-3 flex h-[min(540px,calc(100vh-6.5rem))] w-[min(390px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-[#00D9FF]/30 bg-[#070B18] shadow-[0_24px_64px_rgba(0,0,0,0.65)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-[#F4F7FF]/12 bg-[#10182B] px-4 py-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/30">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate font-display text-sm font-semibold text-[#F4F7FF]">
                    Muavin AI
                  </h2>
                  <p className="truncate font-mono text-[10px] text-[#A6B2C9]">
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
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#F4F7FF]/12 text-[#A6B2C9] hover:border-[#00D9FF]/40 hover:text-[#F4F7FF] transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Minimize Muavin AI"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#F4F7FF]/12 text-[#A6B2C9] hover:border-[#00D9FF]/40 hover:text-[#F4F7FF] transition-colors cursor-pointer"
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
                          ? 'bg-[#00D9FF] text-[#070B18] font-medium'
                          : 'border border-[#F4F7FF]/12 bg-[#10182B] text-[#F4F7FF]'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}

              {showSuggestions && (
                <div className="space-y-1.5 pt-2">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#A6B2C9]">
                    Suggested Questions
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => sendMessage(q)}
                        className="rounded-lg border border-[#F4F7FF]/12 bg-[#10182B]/70 px-3 py-2 text-left text-xs text-[#A6B2C9] hover:border-[#00D9FF]/45 hover:text-[#F4F7FF] transition-colors cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {sending && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-xl border border-[#F4F7FF]/12 bg-[#10182B] px-3.5 py-2.5 text-xs text-[#00D9FF]">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="rounded-xl border border-rose-400/35 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-200">
                  {errorMsg}
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2 border-t border-[#F4F7FF]/12 bg-[#10182B] p-3"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={800}
                placeholder="Ask a question about Ateeq’s portfolio..."
                className="flex-1 rounded-lg border border-[#F4F7FF]/15 bg-[#070B18] px-3 py-2 text-xs text-[#F4F7FF] placeholder-[#A6B2C9]/55 focus:border-[#00D9FF] focus:outline-none"
              />
              <button
                type="submit"
                disabled={sending || input.trim().length === 0}
                aria-label="Send message to Muavin AI"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00D9FF] text-[#070B18] hover:bg-[#3CE4FF] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
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
        className="inline-flex items-center gap-2.5 rounded-full border border-[#00D9FF]/45 bg-[#10182B] px-4 py-3 text-sm font-semibold text-[#F4F7FF] shadow-[0_12px_32px_rgba(0,217,255,0.22)] hover:border-[#00D9FF] hover:bg-[#142038] transition-colors cursor-pointer"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00D9FF] text-[#070B18]">
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

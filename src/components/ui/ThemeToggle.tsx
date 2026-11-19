import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, type ThemePreference } from '../../context/ThemeContext';

const OPTIONS: Array<{
  id: ThemePreference;
  label: string;
  title: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'system', label: 'Auto', title: 'Auto (Follow System Appearance)', Icon: Monitor },
  { id: 'light', label: 'Light', title: 'Light Theme', Icon: Sun },
  { id: 'dark', label: 'Dark', title: 'Dark Theme', Icon: Moon },
];

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { preference, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Theme preference"
      className="inline-flex items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-0.5"
    >
      {OPTIONS.map(({ id, label, title, Icon }) => {
        const active = preference === id;
        return (
          <button
            key={id}
            type="button"
            title={title}
            aria-label={title}
            aria-pressed={active}
            onClick={() => setTheme(id)}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
              active
                ? 'bg-[var(--accent-primary)] text-[var(--accent-on-primary)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {!compact && <span>{label}</span>}
          </button>
        );
      })}
    </div>
  );
}

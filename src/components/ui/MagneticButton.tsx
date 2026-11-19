import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';

interface BaseProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

type ButtonAsLink = BaseProps & {
  to: string;
  href?: never;
  onClick?: () => void;
  type?: never;
  disabled?: never;
};

type ButtonAsAnchor = BaseProps & {
  href: string;
  to?: never;
  onClick?: () => void;
  download?: boolean | string;
  target?: string;
  rel?: string;
  type?: never;
  disabled?: never;
};

type ButtonAsButton = BaseProps & {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  to?: never;
  href?: never;
};

type MagneticButtonProps = ButtonAsLink | ButtonAsAnchor | ButtonAsButton;

export function MagneticButton(props: MagneticButtonProps) {
  const { children, variant = 'primary', className = '' } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const { isMobile, reducedMotion } = useDeviceCapabilities();

  const variantClasses = {
    primary:
      'bg-[var(--accent-primary)] text-[var(--accent-on-primary)] font-semibold hover:bg-[var(--accent-primary-hover)] shadow-[0_10px_28px_var(--glow-primary)]',
    secondary:
      'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-medium hover:border-[var(--border-accent)] hover:bg-[var(--bg-surface-hover)]',
    ghost:
      'bg-transparent text-[var(--text-secondary)] border border-[var(--border-subtle)] font-medium hover:text-[var(--text-primary)] hover:border-[var(--border-accent)]',
  }[variant];

  const baseClass = `inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm whitespace-nowrap shrink-0 transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-out cursor-pointer min-h-[42px] ${variantClasses} ${className}`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.16;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.16;
    setOffset({ x: dx, y: dy });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const style: React.CSSProperties =
    reducedMotion || isMobile
      ? {}
      : {
          transform: `translate3d(${offset.x.toFixed(1)}px, ${offset.y.toFixed(1)}px, 0)`,
        };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className="inline-block transition-transform duration-200 ease-out"
    >
      {'to' in props && props.to ? (
        <Link to={props.to} onClick={props.onClick} className={baseClass}>
          {children}
        </Link>
      ) : 'href' in props && props.href ? (
        <a
          href={props.href}
          target={props.target}
          rel={props.rel}
          download={props.download}
          onClick={props.onClick}
          className={baseClass}
        >
          {children}
        </a>
      ) : (
        <button
          type={props.type ?? 'button'}
          disabled={props.disabled}
          onClick={props.onClick}
          className={`${baseClass} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {children}
        </button>
      )}
    </div>
  );
}

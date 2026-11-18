import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';
import type { ProjectRecord } from '../../types/portfolio';

interface TiltProjectCardProps {
  project: ProjectRecord;
}

export function TiltProjectCard({ project }: TiltProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const { isMobile, reducedMotion } = useDeviceCapabilities();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50, hovering: false });

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (isMobile || reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 7,
      ry: (px - 0.5) * 9,
      mx: px * 100,
      my: py * 100,
      hovering: true,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50, hovering: false });
  };

  const transformStyle: React.CSSProperties =
    isMobile || reducedMotion
      ? {}
      : {
          transform: `perspective(950px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) translateY(${tilt.hovering ? '-3px' : '0px'})`,
        };

  return (
    <article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={transformStyle}
      className="group relative flex flex-col justify-between rounded-2xl border border-[#F4F7FF]/10 bg-[#10182B]/75 p-6 transition-[transform,border-color,background-color] duration-200 ease-out hover:border-[#00D9FF]/35 hover:bg-[#10182B]/90"
    >
      {/* Subtle cursor spotlight */}
      {!isMobile && !reducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{
            background: `radial-gradient(360px circle at ${tilt.mx}% ${tilt.my}%, rgba(0, 217, 255, 0.09), transparent 65%)`,
          }}
        />
      )}

      <div className="relative z-10">
        {/* Clean unboxed metadata row — zero pills */}
        <div className="flex items-center justify-between gap-4 text-xs text-[#A6B2C9]">
          <div className="flex items-center gap-2 font-mono">
            <span className="tabular-nums text-[#00D9FF]">{project.indexLabel}</span>
            <span aria-hidden="true">/</span>
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span>{project.status}</span>
          </div>
          <span className="font-mono text-base font-semibold text-[#8957FF]" aria-hidden="true">
            {project.mathSymbol}
          </span>
        </div>

        <h3 className="mt-4 text-xl font-semibold tracking-tight text-[#F4F7FF] transition-colors group-hover:text-[#00D9FF]">
          <Link to={`/projects/${project.slug}`} className="focus:outline-none">
            {project.title}
          </Link>
        </h3>

        <p className="mt-2.5 text-sm leading-relaxed text-[#A6B2C9]">{project.tagline}</p>

        {/* Unboxed tech stack with typographic separators */}
        <p className="mt-4 font-mono text-xs leading-relaxed text-[#A6B2C9]/85">
          {project.techStack.join(' · ')}
        </p>
      </div>

      <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#F4F7FF]/10 pt-4">
        <Link
          to={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00D9FF] hover:text-[#7CE8FF] transition-colors whitespace-nowrap shrink-0"
        >
          <span>Inspect Details</span>
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>

        <div className="flex items-center gap-4 text-xs font-medium text-[#A6B2C9]">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#F4F7FF] transition-colors whitespace-nowrap shrink-0"
              aria-label={`View ${project.shortTitle} source code on GitHub`}
            >
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              <span>GitHub</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#F4F7FF] transition-colors whitespace-nowrap shrink-0"
              aria-label={`Open ${project.shortTitle} live demo`}
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Live</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

import { useEffect, useState } from 'react';

export interface DeviceCapabilities {
  isMobile: boolean;
  reducedMotion: boolean;
  webglSupported: boolean;
  isSoftwareGl: boolean;
}

function probeWebGL(): { webglSupported: boolean; isSoftwareGl: boolean } {
  if (typeof document === 'undefined') {
    return { webglSupported: true, isSoftwareGl: false };
  }

  try {
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ||
      (canvas.getContext('webgl') as WebGLRenderingContext | null);

    if (!gl) {
      return { webglSupported: false, isSoftwareGl: false };
    }

    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererStr = ext
      ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL))
      : String(gl.getParameter(gl.RENDERER));

    gl.getExtension('WEBGL_lose_context')?.loseContext();

    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererStr);
    return { webglSupported: true, isSoftwareGl };
  } catch {
    return { webglSupported: false, isSoftwareGl: false };
  }
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(() => {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    const reducedMotion =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
    const { webglSupported, isSoftwareGl } = probeWebGL();
    return { isMobile, reducedMotion, webglSupported, isSoftwareGl };
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleResize = () => {
      setCapabilities((prev) => {
        const nextMobile = window.innerWidth < 768;
        return prev.isMobile === nextMobile ? prev : { ...prev, isMobile: nextMobile };
      });
    };
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setCapabilities((prev) => ({ ...prev, reducedMotion: e.matches }));
    };

    window.addEventListener('resize', handleResize, { passive: true });
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return capabilities;
}

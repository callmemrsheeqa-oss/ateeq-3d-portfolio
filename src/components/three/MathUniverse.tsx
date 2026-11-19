import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useTheme } from '../../context/ThemeContext';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';
import { FloatingSymbols } from './FloatingSymbols';
import { ParticleField } from './ParticleField';
import { GeometricScene } from './GeometricScene';

interface MathUniverseProps {
  showHeroSculpture?: boolean;
}

function StudioEnvironmentAndRig({
  pointerRef,
  reducedMotion,
}: {
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
}) {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    return () => {
      scene.environment = null;
      envTarget.dispose();
    };
  }, [gl, scene]);

  useFrame((_state, rawDelta) => {
    if (reducedMotion) return;
    const delta = Math.min(rawDelta, 0.05);
    const targetX = pointerRef.current.x * 0.55;
    const targetY = pointerRef.current.y * 0.35;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2.2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2.2, delta);
    camera.lookAt(0, 0, -1);
  });

  return null;
}

function StaticMathFallback({ isDark }: { isDark: boolean }) {
  const bg = isDark ? '#0A0A0A' : '#F7FAFC';
  const primary = isDark ? '#007BA7' : '#173B63';
  const secondary = isDark ? '#FF2D95' : '#D81B78';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: bg }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 74% 28%, rgba(0, 123, 167, 0.16), transparent 46%), radial-gradient(circle at 22% 76%, rgba(255, 45, 149, 0.11), transparent 50%)'
            : 'radial-gradient(circle at 74% 28%, rgba(23, 59, 99, 0.10), transparent 46%), radial-gradient(circle at 22% 76%, rgba(216, 27, 120, 0.08), transparent 50%)',
        }}
      />
      <svg
        viewBox="0 0 1200 800"
        className={`h-full w-full ${isDark ? 'opacity-28' : 'opacity-22'}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="840" cy="360" r="190" stroke={primary} strokeOpacity="0.55" strokeWidth="1" />
        <ellipse
          cx="840"
          cy="360"
          rx="270"
          ry="95"
          transform="rotate(-24 840 360)"
          stroke={secondary}
          strokeOpacity="0.45"
          strokeWidth="1"
        />
        <ellipse
          cx="840"
          cy="360"
          rx="260"
          ry="110"
          transform="rotate(28 840 360)"
          stroke={primary}
          strokeOpacity="0.38"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

export function MathUniverse({ showHeroSculpture = false }: MathUniverseProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { isMobile, reducedMotion, webglSupported, isSoftwareGl } = useDeviceCapabilities();
  const [contextLost, setContextLost] = useState(false);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  if (!webglSupported || contextLost) {
    return <StaticMathFallback isDark={isDark} />;
  }

  const sculpturePos: [number, number, number] = isMobile ? [0, 1.35, -1.8] : [2.75, 0.25, -1.35];
  const sculptureScale = isMobile ? 0.62 : 0.85;
  const bgColor = isDark ? '#0A0A0A' : '#F7FAFC';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
    >
      <Canvas
        dpr={isSoftwareGl ? 1 : [1, isMobile ? 1.5 : 2]}
        camera={{ position: [0, 0, 7.5], fov: 46, near: 0.1, far: 100 }}
        gl={{
          antialias: !isSoftwareGl,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.06;

          const canvas = gl.domElement;
          const onLost = (event: Event) => {
            event.preventDefault();
            setContextLost(true);
          };
          const onRestored = () => {
            setContextLost(false);
          };
          canvas.addEventListener('webglcontextlost', onLost, false);
          canvas.addEventListener('webglcontextrestored', onRestored, false);
        }}
      >
        <color attach="background" args={[bgColor]} />
        <fogExp2 attach="fog" args={[bgColor, isDark ? 0.042 : 0.036]} />

        <StudioEnvironmentAndRig pointerRef={pointerRef} reducedMotion={reducedMotion} />

        {/* 3-Point studio lighting rig adapted for theme */}
        <hemisphereLight
          args={[
            isDark ? '#88C8E8' : '#FFFFFF',
            isDark ? '#15161B' : '#CBD8E8',
            isDark ? 0.65 : 1.15,
          ]}
        />
        <directionalLight
          position={[6, 7, 5]}
          intensity={isDark ? 1.35 : 1.55}
          color={isDark ? '#FFF4E6' : '#FFFFFF'}
        />
        <pointLight
          position={[-6, -4, 3]}
          intensity={isDark ? 18 : 10}
          color={isDark ? '#FF2D95' : '#D81B78'}
          distance={20}
        />
        <pointLight
          position={[4, 2, 4]}
          intensity={isDark ? 18 : 12}
          color={isDark ? '#007BA7' : '#173B63'}
          distance={18}
        />

        <ParticleField
          isMobile={isMobile}
          reducedMotion={reducedMotion}
          pointerRef={pointerRef}
          isDark={isDark}
        />

        <FloatingSymbols
          isMobile={isMobile}
          reducedMotion={reducedMotion}
          pointerRef={pointerRef}
          density={showHeroSculpture ? 'hero' : 'ambient'}
          isDark={isDark}
        />

        {showHeroSculpture && (
          <GeometricScene
            reducedMotion={reducedMotion}
            pointerRef={pointerRef}
            position={sculpturePos}
            scale={sculptureScale}
            isDark={isDark}
          />
        )}
      </Canvas>

      {/* Subtle theme-aware vignette for high WCAG AA legibility */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 28% 45%, rgba(10, 10, 10, 0.42) 0%, rgba(10, 10, 10, 0.24) 55%, rgba(10, 10, 10, 0.72) 100%)'
            : 'radial-gradient(circle at 28% 45%, rgba(247, 250, 252, 0.56) 0%, rgba(247, 250, 252, 0.25) 55%, rgba(220, 229, 239, 0.55) 100%)',
        }}
      />
    </div>
  );
}

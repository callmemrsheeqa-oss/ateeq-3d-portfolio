import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
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

function StaticMathFallback() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#070B18]"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 72% 28%, rgba(0, 217, 255, 0.12), transparent 46%), radial-gradient(circle at 22% 76%, rgba(137, 87, 255, 0.12), transparent 50%)',
        }}
      />
      <svg
        viewBox="0 0 1200 800"
        className="h-full w-full opacity-25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="840" cy="360" r="190" stroke="#00D9FF" strokeOpacity="0.45" strokeWidth="1" />
        <ellipse
          cx="840"
          cy="360"
          rx="270"
          ry="95"
          transform="rotate(-24 840 360)"
          stroke="#8957FF"
          strokeOpacity="0.5"
          strokeWidth="1"
        />
        <ellipse
          cx="840"
          cy="360"
          rx="260"
          ry="110"
          transform="rotate(28 840 360)"
          stroke="#00D9FF"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

export function MathUniverse({ showHeroSculpture = false }: MathUniverseProps) {
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
    return <StaticMathFallback />;
  }

  const sculpturePos: [number, number, number] = isMobile ? [0, 1.35, -1.6] : [2.45, 0.15, -0.8];
  const sculptureScale = isMobile ? 0.65 : 0.92;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#070B18]"
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
          gl.toneMappingExposure = 1.08;

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
        <color attach="background" args={['#070B18']} />
        <fogExp2 attach="fog" args={['#070B18', 0.042]} />

        <StudioEnvironmentAndRig pointerRef={pointerRef} reducedMotion={reducedMotion} />

        {/* 3-Point studio lighting rig */}
        <hemisphereLight args={['#94B8FF', '#10182B', 0.55]} />
        <directionalLight position={[6, 7, 5]} intensity={1.35} color="#FFF4E6" />
        <pointLight position={[-6, -4, 3]} intensity={18} color="#8957FF" distance={20} />
        <pointLight position={[4, 2, 4]} intensity={16} color="#00D9FF" distance={18} />

        <ParticleField
          isMobile={isMobile}
          reducedMotion={reducedMotion}
          pointerRef={pointerRef}
        />

        <FloatingSymbols
          isMobile={isMobile}
          reducedMotion={reducedMotion}
          pointerRef={pointerRef}
          density={showHeroSculpture ? 'hero' : 'ambient'}
        />

        {showHeroSculpture && (
          <GeometricScene
            reducedMotion={reducedMotion}
            pointerRef={pointerRef}
            position={sculpturePos}
            scale={sculptureScale}
          />
        )}
      </Canvas>

      {/* Subtle vignette so foreground typography retains high WCAG AA contrast */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 28% 45%, rgba(7, 11, 24, 0.45) 0%, rgba(7, 11, 24, 0.25) 55%, rgba(7, 11, 24, 0.7) 100%)',
        }}
      />
    </div>
  );
}

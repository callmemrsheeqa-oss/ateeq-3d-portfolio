import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useTheme } from '../../context/ThemeContext';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';
import type { InterestArtworkMode } from '../../data/interests';
import type { ProjectGeometryMotif } from '../../data/projects';

export type ArtworkVariant = InterestArtworkMode | ProjectGeometryMotif;

interface InteractiveMathArtworkProps {
  variant: ArtworkVariant;
  className?: string;
  parameterP?: number;
  parameterQ?: number;
  interactive?: boolean;
}

function StudioEnv() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const target = pmrem.fromScene(room, 0.04);
    scene.environment = target.texture;
    room.dispose();
    pmrem.dispose();

    return () => {
      scene.environment = null;
      target.dispose();
    };
  }, [gl, scene]);

  return null;
}

function TorusKnotSculpture({
  p = 2,
  q = 3,
  reducedMotion,
  isDark,
}: {
  p?: number;
  q?: number;
  reducedMotion: boolean;
  isDark: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const primaryHex = isDark ? '#007BA7' : '#173B63';
  const secondaryHex = isDark ? '#FF2D95' : '#D81B78';

  useFrame((state) => {
    if (reducedMotion || !groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.28;
    groupRef.current.rotation.x = Math.sin(t * 0.35) * 0.18;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <torusKnotGeometry args={[0.92, 0.24, 160, 24, p, q]} />
        <meshPhysicalMaterial
          color={isDark ? '#152538' : '#173B63'}
          emissive={primaryHex}
          emissiveIntensity={isDark ? 0.35 : 0.14}
          metalness={0.85}
          roughness={0.18}
          clearcoat={0.9}
        />
      </mesh>
      <mesh>
        <torusKnotGeometry args={[0.92, 0.246, 96, 12, p, q]} />
        <meshBasicMaterial
          color={isDark ? '#38B6E6' : '#DCE5EF'}
          wireframe
          transparent
          opacity={isDark ? 0.24 : 0.28}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.62, 0.015, 12, 96]} />
        <meshStandardMaterial
          color={secondaryHex}
          emissive={secondaryHex}
          emissiveIntensity={isDark ? 0.45 : 0.2}
        />
      </mesh>
    </group>
  );
}

function LorenzAttractorSculpture({
  reducedMotion,
  isDark,
}: {
  reducedMotion: boolean;
  isDark: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const particleRef = useRef<THREE.Mesh>(null);
  const primaryHex = isDark ? '#007BA7' : '#173B63';
  const secondaryHex = isDark ? '#FF2D95' : '#D81B78';

  const { tubeGeo, curve } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    let x = 0.1;
    let y = 0;
    let z = 0;
    const sigma = 10;
    const rho = 28;
    const beta = 8 / 3;
    const dt = 0.008;

    for (let i = 0; i < 1200; i++) {
      const dx = sigma * (y - x);
      const dy = x * (rho - z) - y;
      const dz = x * y - beta * z;
      x += dx * dt;
      y += dy * dt;
      z += dz * dt;
      if (i > 60 && i % 4 === 0) {
        pts.push(new THREE.Vector3(x * 0.068, (z - 25) * 0.068, y * 0.068));
      }
    }

    const c = new THREE.CatmullRomCurve3(pts);
    return {
      curve: c,
      tubeGeo: new THREE.TubeGeometry(c, 320, 0.022, 8, false),
    };
  }, []);

  useEffect(() => {
    return () => {
      tubeGeo.dispose();
    };
  }, [tubeGeo]);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.18;
    }
    if (particleRef.current) {
      const u = (t * 0.09) % 1;
      curve.getPointAt(u, particleRef.current.position);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={tubeGeo}>
        <meshStandardMaterial
          color={primaryHex}
          emissive={secondaryHex}
          emissiveIntensity={isDark ? 0.35 : 0.14}
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial
          color={isDark ? '#F8FAFC' : '#D81B78'}
          emissive={isDark ? '#38B6E6' : '#D81B78'}
          emissiveIntensity={isDark ? 1.0 : 0.45}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.55, 0]}>
        <ringGeometry args={[1.45, 1.48, 64]} />
        <meshBasicMaterial color={primaryHex} transparent opacity={0.38} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function PolyhedralSymmetrySculpture({
  reducedMotion,
  isDark,
}: {
  reducedMotion: boolean;
  isDark: boolean;
}) {
  const outerRef = useRef<THREE.Mesh>(null);
  const midRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const primaryHex = isDark ? '#007BA7' : '#173B63';
  const secondaryHex = isDark ? '#FF2D95' : '#D81B78';

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (outerRef.current) {
      outerRef.current.rotation.y = t * 0.2;
      outerRef.current.rotation.x = t * 0.12;
    }
    if (midRef.current) {
      midRef.current.rotation.y = -t * 0.28;
      midRef.current.rotation.z = t * 0.15;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 0.35;
    }
  });

  return (
    <group>
      <mesh ref={outerRef}>
        <dodecahedronGeometry args={[1.38, 0]} />
        <meshStandardMaterial
          color={primaryHex}
          emissive={primaryHex}
          emissiveIntensity={isDark ? 0.32 : 0.1}
          wireframe
        />
      </mesh>
      <mesh ref={midRef}>
        <icosahedronGeometry args={[0.98, 0]} />
        <meshPhysicalMaterial
          color={isDark ? '#1A1C28' : '#244A75'}
          emissive={secondaryHex}
          emissiveIntensity={isDark ? 0.28 : 0.14}
          metalness={0.85}
          roughness={0.2}
          transparent
          opacity={0.78}
        />
      </mesh>
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.52, 0]} />
        <meshStandardMaterial
          color={isDark ? '#F8FAFC' : '#D81B78'}
          emissive={primaryHex}
          emissiveIntensity={isDark ? 0.6 : 0.25}
          metalness={0.88}
          roughness={0.18}
        />
      </mesh>
    </group>
  );
}

function HarmonicWaveManifold({
  reducedMotion,
  isDark,
}: {
  reducedMotion: boolean;
  isDark: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const basePositions = useRef<Float32Array | null>(null);
  const primaryHex = isDark ? '#38B6E6' : '#173B63';
  const secondaryHex = isDark ? '#FF2D95' : '#D81B78';

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(2.9, 2.9, 28, 28);
    geo.rotateX(-Math.PI / 2.6);
    basePositions.current = new Float32Array(geo.attributes.position.array as Float32Array);
    return geo;
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((state) => {
    if (reducedMotion || !meshRef.current || !basePositions.current) return;
    const t = state.clock.elapsedTime;
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const base = basePositions.current;

    for (let i = 0; i < pos.count; i++) {
      const bx = base[i * 3];
      const by = base[i * 3 + 1];
      const bz = base[i * 3 + 2];
      const r = Math.sqrt(bx * bx + bz * bz);
      const wave =
        Math.sin(bx * 2.2 + t * 1.4) * 0.18 +
        Math.cos(bz * 2.2 - t * 1.1) * 0.16 +
        Math.sin(r * 3.1 - t * 1.8) * 0.12;
      pos.setY(i, by + wave);
    }
    pos.needsUpdate = true;
    meshRef.current.rotation.y = t * 0.12;
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color={primaryHex}
          emissive={isDark ? '#007BA7' : '#173B63'}
          emissiveIntensity={isDark ? 0.35 : 0.1}
          wireframe
        />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <torusGeometry args={[1.55, 0.015, 12, 72]} />
        <meshStandardMaterial
          color={secondaryHex}
          emissive={secondaryHex}
          emissiveIntensity={isDark ? 0.42 : 0.18}
        />
      </mesh>
    </group>
  );
}

function SculptureRouter({
  variant,
  p,
  q,
  reducedMotion,
  isDark,
}: {
  variant: ArtworkVariant;
  p?: number;
  q?: number;
  reducedMotion: boolean;
  isDark: boolean;
}) {
  switch (variant) {
    case 'torus-knot':
    case 'harmonic-torus':
      return <TorusKnotSculpture p={p} q={q} reducedMotion={reducedMotion} isDark={isDark} />;
    case 'lorenz-flow':
    case 'neural-lattice':
    case 'vector-manifold':
      return <LorenzAttractorSculpture reducedMotion={reducedMotion} isDark={isDark} />;
    case 'polyhedral-lattice':
    case 'group-symmetry':
    case 'polyhedral-prism':
      return <PolyhedralSymmetrySculpture reducedMotion={reducedMotion} isDark={isDark} />;
    case 'harmonic-wave':
    case 'orbital-wave':
    case 'simplex-frontier':
    case 'stochastic-grid':
    default:
      return <HarmonicWaveManifold reducedMotion={reducedMotion} isDark={isDark} />;
  }
}

export function InteractiveMathArtwork({
  variant,
  className = 'h-72 w-full',
  parameterP = 2,
  parameterQ = 3,
  interactive = true,
}: InteractiveMathArtworkProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { reducedMotion, webglSupported, isSoftwareGl } = useDeviceCapabilities();
  const [lost, setLost] = useState(false);

  if (!webglSupported || lost) {
    return (
      <div
        className={`${className} flex items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]`}
      >
        <span className="font-mono text-sm text-[var(--accent-ink)]">
          Interactive 3D Manifold Preview
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${className} relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]`}
    >
      <Canvas
        dpr={isSoftwareGl ? 1 : [1, 1.75]}
        camera={{ position: [0, 0.4, 4.4], fov: 44 }}
        gl={{ antialias: !isSoftwareGl, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            setLost(true);
          });
          gl.domElement.addEventListener('webglcontextrestored', () => setLost(false));
        }}
      >
        <color attach="background" args={[isDark ? '#0D0E12' : '#EEF4FA']} />
        <StudioEnv />
        <hemisphereLight
          args={[
            isDark ? '#88C8E8' : '#FFFFFF',
            isDark ? '#15161B' : '#CBD8E8',
            isDark ? 0.75 : 1.15,
          ]}
        />
        <directionalLight position={[4, 5, 4]} intensity={1.3} color="#FFFFFF" />
        <pointLight
          position={[-4, -3, 3]}
          intensity={isDark ? 14 : 8}
          color={isDark ? '#FF2D95' : '#D81B78'}
        />
        <pointLight
          position={[3, 2, 3]}
          intensity={isDark ? 12 : 9}
          color={isDark ? '#007BA7' : '#173B63'}
        />

        <SculptureRouter
          variant={variant}
          p={parameterP}
          q={parameterQ}
          reducedMotion={reducedMotion}
          isDark={isDark}
        />

        {interactive && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping={!isSoftwareGl}
            dampingFactor={0.06}
            rotateSpeed={0.75}
          />
        )}
      </Canvas>
    </div>
  );
}

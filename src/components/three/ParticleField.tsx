import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  isMobile: boolean;
  reducedMotion: boolean;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
}

function seeded(i: number): number {
  const v = Math.sin(i * 91.3458) * 47453.5453;
  return v - Math.floor(v);
}

export function ParticleField({ isMobile, reducedMotion, pointerRef }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const gridRef = useRef<THREE.Group>(null);
  const count = isMobile ? 110 : 240;

  const { geometry } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const cyan = new THREE.Color('#00D9FF');
    const violet = new THREE.Color('#8957FF');
    const softWhite = new THREE.Color('#F4F7FF');

    for (let i = 0; i < count; i++) {
      // Fibonacci-like spherical distribution mixed with ambient depth
      const u = seeded(i + 1);
      const v = seeded(i + 201);
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const r = 6 + seeded(i + 401) * 14;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 1.45;
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.95;
      positions[i * 3 + 2] = -4 - seeded(i + 601) * 12;

      const pick = seeded(i + 801);
      const c = pick < 0.45 ? cyan : pick < 0.8 ? violet : softWhite;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return { geometry: geo };
  }, [count]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((state, rawDelta) => {
    if (reducedMotion) return;
    const delta = Math.min(rawDelta, 0.05);
    const t = state.clock.elapsedTime;

    if (pointsRef.current) {
      pointsRef.current.rotation.y = THREE.MathUtils.damp(
        pointsRef.current.rotation.y,
        t * 0.015 + pointerRef.current.x * 0.08,
        2.5,
        delta,
      );
      pointsRef.current.rotation.x = THREE.MathUtils.damp(
        pointsRef.current.rotation.x,
        pointerRef.current.y * 0.05,
        2.5,
        delta,
      );
    }

    if (gridRef.current) {
      gridRef.current.rotation.z = t * 0.02;
    }
  });

  return (
    <group>
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          size={isMobile ? 0.055 : 0.048}
          vertexColors
          transparent
          opacity={0.55}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Subtle ambient wireframe geometric backdrop */}
      <group ref={gridRef} position={[0, 0, -9]}>
        <mesh rotation={[Math.PI / 5, Math.PI / 7, 0]}>
          <icosahedronGeometry args={[7.5, 1]} />
          <meshBasicMaterial color="#1E2B4D" wireframe transparent opacity={0.18} />
        </mesh>
      </group>
    </group>
  );
}

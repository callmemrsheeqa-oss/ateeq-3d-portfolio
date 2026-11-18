import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GeometricSceneProps {
  reducedMotion: boolean;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  position?: [number, number, number];
  scale?: number;
}

const _targetRot = new THREE.Vector2();

export function GeometricScene({
  reducedMotion,
  pointerRef,
  position = [0, 0, 0],
  scale = 1,
}: GeometricSceneProps) {
  const rootRef = useRef<THREE.Group>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const outerShellRef = useRef<THREE.Mesh>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);
  const ringCRef = useRef<THREE.Mesh>(null);
  const knotRef = useRef<THREE.Mesh>(null);
  const nodesRef = useRef<THREE.Group>(null);

  // Parametric closed mathematical curve (3D Lissajous/Harmonic filament)
  const filamentGeometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const steps = 96;
    for (let i = 0; i < steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const x = Math.sin(t * 2) * 1.45;
      const y = Math.cos(t * 3) * 1.15;
      const z = Math.sin(t * 3 + Math.PI / 4) * 1.35;
      pts.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(pts, true);
    return new THREE.TubeGeometry(curve, 128, 0.018, 8, true);
  }, []);

  useEffect(() => {
    return () => {
      filamentGeometry.dispose();
    };
  }, [filamentGeometry]);

  useFrame((state, rawDelta) => {
    if (reducedMotion) return;
    const delta = Math.min(rawDelta, 0.05);
    const t = state.clock.elapsedTime;

    if (rootRef.current) {
      _targetRot.set(pointerRef.current.y * 0.25, pointerRef.current.x * 0.35);
      rootRef.current.rotation.x = THREE.MathUtils.damp(
        rootRef.current.rotation.x,
        _targetRot.x,
        3.5,
        delta,
      );
      rootRef.current.rotation.y = THREE.MathUtils.damp(
        rootRef.current.rotation.y,
        _targetRot.y + t * 0.08,
        3.5,
        delta,
      );
    }

    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = -t * 0.35;
      innerCoreRef.current.rotation.x = t * 0.22;
    }

    if (outerShellRef.current) {
      outerShellRef.current.rotation.y = t * 0.14;
      outerShellRef.current.rotation.z = -t * 0.09;
    }

    if (ringARef.current) ringARef.current.rotation.z = t * 0.22;
    if (ringBRef.current) ringBRef.current.rotation.x = -t * 0.18;
    if (ringCRef.current) ringCRef.current.rotation.y = t * 0.16;
    if (knotRef.current) knotRef.current.rotation.z = -t * 0.12;
    if (nodesRef.current) {
      nodesRef.current.rotation.y = t * 0.32;
      nodesRef.current.rotation.x = Math.sin(t * 0.4) * 0.25;
    }
  });

  return (
    <group ref={rootRef} position={position} scale={scale}>
      {/* Part 1: Luminous inner harmonic core */}
      <mesh ref={innerCoreRef}>
        <octahedronGeometry args={[0.62, 0]} />
        <meshPhysicalMaterial
          color="#132347"
          emissive="#00D9FF"
          emissiveIntensity={0.45}
          metalness={0.85}
          roughness={0.18}
          clearcoat={0.8}
        />
      </mesh>

      {/* Part 2: Outer faceted geodesic wireframe manifold */}
      <mesh ref={outerShellRef}>
        <icosahedronGeometry args={[1.28, 1]} />
        <meshStandardMaterial
          color="#00D9FF"
          emissive="#00D9FF"
          emissiveIntensity={0.25}
          wireframe
          transparent
          opacity={0.42}
        />
      </mesh>

      {/* Part 3-5: Three inclined precision orbital rings */}
      <mesh ref={ringARef} rotation={[Math.PI / 3, 0.2, 0]}>
        <torusGeometry args={[1.82, 0.022, 16, 120]} />
        <meshStandardMaterial
          color="#00D9FF"
          emissive="#00D9FF"
          emissiveIntensity={0.45}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      <mesh ref={ringBRef} rotation={[-Math.PI / 3.4, Math.PI / 5, 0.4]}>
        <torusGeometry args={[2.08, 0.018, 16, 120]} />
        <meshStandardMaterial
          color="#8957FF"
          emissive="#8957FF"
          emissiveIntensity={0.5}
          metalness={0.88}
          roughness={0.2}
        />
      </mesh>

      <mesh ref={ringCRef} rotation={[Math.PI / 2.1, -Math.PI / 4, 0]}>
        <torusGeometry args={[2.34, 0.012, 12, 120]} />
        <meshStandardMaterial
          color="#A6B2C9"
          metalness={0.92}
          roughness={0.28}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Part 6: Parametric closed harmonic tube */}
      <mesh ref={knotRef} geometry={filamentGeometry}>
        <meshStandardMaterial
          color="#7CE8FF"
          emissive="#8957FF"
          emissiveIntensity={0.35}
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      {/* Part 7: Orbiting mathematical vertex nodes */}
      <group ref={nodesRef}>
        {[
          [1.82, 0, 0, '#00D9FF'],
          [-1.82, 0, 0, '#8957FF'],
          [0, 1.48, 1.48, '#F4F7FF'],
          [0, -1.48, -1.48, '#00D9FF'],
        ].map(([x, y, z, col], i) => (
          <mesh key={i} position={[x as number, y as number, z as number]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial
              color={col as string}
              emissive={col as string}
              emissiveIntensity={0.85}
              roughness={0.2}
              metalness={0.4}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

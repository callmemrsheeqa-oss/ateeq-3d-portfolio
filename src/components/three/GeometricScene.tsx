import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GeometricSceneProps {
  reducedMotion: boolean;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  position?: [number, number, number];
  scale?: number;
  isDark?: boolean;
}

const _targetRot = new THREE.Vector2();

export function GeometricScene({
  reducedMotion,
  pointerRef,
  position = [0, 0, 0],
  scale = 1,
  isDark = true,
}: GeometricSceneProps) {
  const rootRef = useRef<THREE.Group>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const outerShellRef = useRef<THREE.Mesh>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);
  const ringCRef = useRef<THREE.Mesh>(null);
  const knotRef = useRef<THREE.Mesh>(null);
  const nodesRef = useRef<THREE.Group>(null);

  const primaryHex = isDark ? '#007BA7' : '#173B63';
  const primaryGlow = isDark ? '#38B6E6' : '#255B96';
  const secondaryHex = isDark ? '#FF2D95' : '#D81B78';
  const neutralHex = isDark ? '#A7B0BE' : '#536579';
  const coreHex = isDark ? '#15161B' : '#14253D';

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
      <mesh ref={innerCoreRef}>
        <octahedronGeometry args={[0.62, 0]} />
        <meshPhysicalMaterial
          color={coreHex}
          emissive={primaryHex}
          emissiveIntensity={isDark ? 0.5 : 0.22}
          metalness={0.85}
          roughness={0.2}
          clearcoat={0.8}
        />
      </mesh>

      <mesh ref={outerShellRef}>
        <icosahedronGeometry args={[1.28, 1]} />
        <meshStandardMaterial
          color={primaryGlow}
          emissive={primaryHex}
          emissiveIntensity={isDark ? 0.28 : 0.12}
          wireframe
          transparent
          opacity={isDark ? 0.42 : 0.32}
        />
      </mesh>

      <mesh ref={ringARef} rotation={[Math.PI / 3, 0.2, 0]}>
        <torusGeometry args={[1.82, 0.022, 16, 120]} />
        <meshStandardMaterial
          color={primaryHex}
          emissive={primaryGlow}
          emissiveIntensity={isDark ? 0.42 : 0.18}
          metalness={0.88}
          roughness={0.18}
        />
      </mesh>

      <mesh ref={ringBRef} rotation={[-Math.PI / 3.4, Math.PI / 5, 0.4]}>
        <torusGeometry args={[2.08, 0.018, 16, 120]} />
        <meshStandardMaterial
          color={secondaryHex}
          emissive={secondaryHex}
          emissiveIntensity={isDark ? 0.45 : 0.18}
          metalness={0.85}
          roughness={0.22}
        />
      </mesh>

      <mesh ref={ringCRef} rotation={[Math.PI / 2.1, -Math.PI / 4, 0]}>
        <torusGeometry args={[2.34, 0.012, 12, 120]} />
        <meshStandardMaterial
          color={neutralHex}
          metalness={0.85}
          roughness={0.3}
          transparent
          opacity={isDark ? 0.68 : 0.55}
        />
      </mesh>

      <mesh ref={knotRef} geometry={filamentGeometry}>
        <meshStandardMaterial
          color={primaryGlow}
          emissive={secondaryHex}
          emissiveIntensity={isDark ? 0.28 : 0.12}
          metalness={0.7}
          roughness={0.26}
        />
      </mesh>

      <group ref={nodesRef}>
        {[
          [1.82, 0, 0, primaryGlow],
          [-1.82, 0, 0, secondaryHex],
          [0, 1.48, 1.48, isDark ? '#F8FAFC' : '#14253D'],
          [0, -1.48, -1.48, primaryHex],
        ].map(([x, y, z, col], i) => (
          <mesh key={i} position={[x as number, y as number, z as number]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial
              color={col as string}
              emissive={col as string}
              emissiveIntensity={isDark ? 0.75 : 0.25}
              roughness={0.22}
              metalness={0.45}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

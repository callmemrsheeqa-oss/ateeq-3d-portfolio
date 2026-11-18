import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingSymbolsProps {
  isMobile: boolean;
  reducedMotion: boolean;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  density?: 'hero' | 'ambient';
}

interface SymbolSpec {
  id: number;
  label: string;
  basePos: [number, number, number];
  scale: number;
  aspect: number;
  color: string;
  opacity: number;
  speed: number;
  phase: number;
  driftAmp: number;
  rotAmp: number;
  repelStrength: number;
}

const SYMBOLS = [
  'π',
  '∑',
  '∫',
  '∞',
  '√',
  'Δ',
  'θ',
  'λ',
  'α',
  'β',
  '∇',
  '∂',
  'f(x)',
  'E = mc²',
  'e^{iπ}+1=0',
  '∮',
  'ℝⁿ',
  'G/N',
];

const PALETTE = ['#00D9FF', '#8957FF', '#F4F7FF', '#7CE8FF', '#B79BFF'];

// Pre-allocated scratch vectors to keep useFrame GC-free
const _pointerWorld = new THREE.Vector3();
const _delta = new THREE.Vector3();

function createSymbolTexture(label: string, color: string, maxAnisotropy: number): {
  texture: THREE.CanvasTexture;
  aspect: number;
} {
  const isFormula = label.length > 2;
  const width = isFormula ? 512 : 256;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, width, height);

    // Subtle soft glow behind glyph
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const fontSize = isFormula ? 68 : 132;
    ctx.font = `600 ${fontSize}px "JetBrains Mono", "Outfit", ui-monospace, monospace`;
    ctx.fillText(label, width / 2, height / 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(4, maxAnisotropy);
  texture.needsUpdate = true;

  return { texture, aspect: width / height };
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function FloatingSymbols({
  isMobile,
  reducedMotion,
  pointerRef,
  density = 'ambient',
}: FloatingSymbolsProps) {
  const { gl } = useThree();
  const groupRefs = useRef<Array<THREE.Mesh | null>>([]);

  const count = isMobile ? (density === 'hero' ? 12 : 8) : density === 'hero' ? 24 : 16;

  const symbolItems = useMemo(() => {
    const maxAniso = gl.capabilities.getMaxAnisotropy();
    const items: Array<SymbolSpec & { texture: THREE.CanvasTexture }> = [];

    for (let i = 0; i < count; i++) {
      const label = SYMBOLS[i % SYMBOLS.length];
      const color = PALETTE[i % PALETTE.length];
      const { texture, aspect } = createSymbolTexture(label, color, maxAniso);

      // Distribute across a wide 3D volume, keeping center clear enough for text readability
      const angle = (i / count) * Math.PI * 2 + pseudoRandom(i + 1) * 0.65;
      const radiusX = 3.2 + pseudoRandom(i + 11) * (isMobile ? 3.5 : 7.8);
      const y = (pseudoRandom(i + 23) - 0.5) * (isMobile ? 7.0 : 8.5);
      const z = -1.5 - pseudoRandom(i + 37) * 9.5;
      const x = Math.cos(angle) * radiusX;

      const scaleBase = label.length > 2 ? 0.65 : 0.52;
      const scale = scaleBase + pseudoRandom(i + 51) * 0.48;

      items.push({
        id: i,
        label,
        basePos: [x, y, z],
        scale,
        aspect,
        color,
        opacity: density === 'hero' ? 0.28 + pseudoRandom(i + 67) * 0.38 : 0.16 + pseudoRandom(i + 67) * 0.22,
        speed: 0.22 + pseudoRandom(i + 79) * 0.28,
        phase: pseudoRandom(i + 97) * Math.PI * 2,
        driftAmp: 0.28 + pseudoRandom(i + 109) * 0.35,
        rotAmp: 0.14 + pseudoRandom(i + 131) * 0.2,
        repelStrength: 0.6 + pseudoRandom(i + 149) * 0.6,
        texture,
      });
    }

    return items;
  }, [count, density, gl, isMobile]);

  useEffect(() => {
    return () => {
      symbolItems.forEach((item) => item.texture.dispose());
    };
  }, [symbolItems]);

  useFrame((state, rawDelta) => {
    if (reducedMotion) return;
    const delta = Math.min(rawDelta, 0.05);
    const t = state.clock.elapsedTime;

    _pointerWorld.set(pointerRef.current.x * 7.5, pointerRef.current.y * 4.5, 0);

    for (let i = 0; i < symbolItems.length; i++) {
      const mesh = groupRefs.current[i];
      if (!mesh) continue;
      const spec = symbolItems[i];

      const floatX = Math.sin(t * spec.speed + spec.phase) * spec.driftAmp;
      const floatY = Math.cos(t * (spec.speed * 0.83) + spec.phase * 1.3) * spec.driftAmp;
      const floatZ = Math.sin(t * (spec.speed * 0.61) + spec.phase * 0.7) * (spec.driftAmp * 0.6);

      const targetX = spec.basePos[0] + floatX;
      const targetY = spec.basePos[1] + floatY;
      const targetZ = spec.basePos[2] + floatZ;

      _delta.set(targetX - _pointerWorld.x, targetY - _pointerWorld.y, 0);
      const distSq = _delta.lengthSq();
      const influenceRadius = 16;

      let repelX = 0;
      let repelY = 0;
      if (distSq < influenceRadius && distSq > 0.0001) {
        const dist = Math.sqrt(distSq);
        const falloff = (1 - dist / 4) * spec.repelStrength;
        repelX = (_delta.x / dist) * falloff;
        repelY = (_delta.y / dist) * falloff;
      }

      mesh.position.x = THREE.MathUtils.damp(mesh.position.x, targetX + repelX, 3.2, delta);
      mesh.position.y = THREE.MathUtils.damp(mesh.position.y, targetY + repelY, 3.2, delta);
      mesh.position.z = THREE.MathUtils.damp(mesh.position.z, targetZ, 3.2, delta);

      mesh.rotation.z = Math.sin(t * spec.speed * 0.7 + spec.phase) * spec.rotAmp;
      mesh.rotation.y = Math.cos(t * spec.speed * 0.5 + spec.phase) * (spec.rotAmp * 0.8);
    }
  });

  return (
    <group>
      {symbolItems.map((item, idx) => (
        <mesh
          key={item.id}
          ref={(el) => {
            groupRefs.current[idx] = el;
          }}
          position={item.basePos}
        >
          <planeGeometry args={[item.scale * item.aspect, item.scale]} />
          <meshBasicMaterial
            map={item.texture}
            transparent
            opacity={item.opacity}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

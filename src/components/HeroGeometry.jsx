import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ── Orbiting particle ring ── */
function ParticleRing({ count = 120 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.4 + (Math.random() - 0.5) * 0.6;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, [count]);

  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) s[i] = Math.random() * 2 + 0.5;
    return s;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.002;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-size" array={sizes} count={count} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#81C4FF"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ── Floating shards orbiting the main shape ── */
function FloatingShard({ position, scale, speed }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed;
      ref.current.position.x = position[0] + Math.sin(t) * 0.3;
      ref.current.position.y = position[1] + Math.cos(t * 1.3) * 0.2;
      ref.current.position.z = position[2] + Math.sin(t * 0.7) * 0.2;
      ref.current.rotation.x += 0.01;
      ref.current.rotation.z += 0.008;
    }
  });

  return (
    <mesh ref={ref} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#4F6BFF"
        transparent
        opacity={0.15}
        wireframe
      />
    </mesh>
  );
}

/* ── Main glass icosahedron ── */
function GlassIcosahedron() {
  const meshRef = useRef();
  const innerRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.y += 0.003;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= 0.005;
      innerRef.current.rotation.z += 0.004;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
      {/* Outer glass shape */}
      <mesh ref={meshRef} scale={1.8}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.6}
          chromaticAberration={0.25}
          anisotropy={0.4}
          distortion={0.3}
          distortionScale={0.4}
          temporalDistortion={0.15}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          color="#4F6BFF"
          roughness={0.05}
          transmission={0.97}
          ior={1.5}
        />
      </mesh>

      {/* Inner rotating octahedron */}
      <mesh ref={innerRef} scale={0.7}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#81C4FF"
          emissive="#3035FF"
          emissiveIntensity={0.3}
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh scale={1.83}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#597DFF"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>

      {/* Glow core */}
      <mesh scale={0.3}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#4F6BFF"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </Float>
  );
}

export default function HeroGeometry() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} color="#81C4FF" />
        <directionalLight position={[-3, -3, 2]} intensity={0.3} color="#4F6BFF" />
        <pointLight position={[0, 0, 3]} intensity={0.5} color="#597DFF" />
        <pointLight position={[-4, 2, -2]} intensity={0.2} color="#3035FF" />

        <GlassIcosahedron />
        <ParticleRing />

        {/* Floating shards */}
        <FloatingShard position={[2.2, 1, -1]} scale={0.12} speed={0.6} />
        <FloatingShard position={[-2, -0.8, 0.5]} scale={0.09} speed={0.8} />
        <FloatingShard position={[1.5, -1.5, 1]} scale={0.1} speed={0.5} />
        <FloatingShard position={[-1.8, 1.2, -0.5]} scale={0.08} speed={0.7} />
      </Canvas>
    </div>
  );
}

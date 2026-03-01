import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

function GlassIcosahedron() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef} scale={1.8}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.5}
          chromaticAberration={0.15}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          color="#6366f1"
          roughness={0.1}
          transmission={0.95}
          ior={1.5}
        />
      </mesh>
      {/* Wireframe overlay */}
      <mesh scale={1.82}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#6366f1"
          wireframe
          transparent
          opacity={0.08}
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
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} color="#818cf8" />
        <directionalLight position={[-3, -3, 2]} intensity={0.3} color="#8b5cf6" />
        <pointLight position={[0, 0, 3]} intensity={0.4} color="#6366f1" />
        <GlassIcosahedron />
      </Canvas>
    </div>
  );
}

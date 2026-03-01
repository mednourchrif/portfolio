import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Simplex-style noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // Fractal brownian motion for richer texture
  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.06;
    
    // Mouse influence with smooth parallax
    vec2 mouse = uMouse * 0.25;
    
    // Warp coordinates for organic flow
    float warp = snoise(vec3(uv * 2.0, t * 0.5)) * 0.08;
    vec2 warpedUv = uv + vec2(warp, warp * 0.7);
    
    // Layer 1 - deep flowing aurora
    float n1 = fbm(vec3(warpedUv * 1.2 + mouse * 0.08, t * 0.7)) * 0.5 + 0.5;
    
    // Layer 2 - mid-frequency ribbons
    float n2 = snoise(vec3(warpedUv * 2.5 - mouse * 0.12, t * 1.1 + 10.0)) * 0.5 + 0.5;
    
    // Layer 3 - high-frequency detail
    float n3 = snoise(vec3(uv * 4.0 + mouse * 0.05, t * 0.9 + 20.0)) * 0.5 + 0.5;
    
    // Layer 4 - slow undulating wave
    float n4 = snoise(vec3(uv.x * 0.8 + t * 0.15, uv.y * 1.5, t * 0.4)) * 0.5 + 0.5;
    
    // Layer 5 - micro particles / dust
    float n5 = snoise(vec3(uv * 8.0, t * 1.5 + 40.0)) * 0.5 + 0.5;
    float particles = smoothstep(0.72, 0.78, n5) * 0.15;
    
    // New blue color palette
    vec3 deepBg   = vec3(0.024, 0.024, 0.055);      // #06060e
    vec3 blue100  = vec3(0.506, 0.769, 1.000);       // #81C4FF
    vec3 blue400  = vec3(0.388, 0.561, 1.000);       // #638FFF
    vec3 blue600  = vec3(0.310, 0.420, 1.000);       // #4F6BFF
    vec3 blue900  = vec3(0.188, 0.208, 1.000);       // #3035FF
    vec3 blue1200 = vec3(0.071, 0.000, 1.000);       // #1200FF
    vec3 darkBlue = vec3(0.047, 0.047, 0.157);       // #0c0c28
    
    // Mix colors with rich layering
    vec3 color = deepBg;
    color = mix(color, darkBlue, n1 * 0.5);
    color = mix(color, blue900 * 0.12, n2 * 0.35);
    color = mix(color, blue600 * 0.08, n3 * 0.2);
    color = mix(color, blue400 * 0.06, n4 * 0.25);
    
    // Aurora-like bright ribbons
    float aurora = smoothstep(0.55, 0.7, n1) * smoothstep(0.4, 0.6, n2);
    color += blue100 * aurora * 0.04;
    color += blue600 * aurora * 0.06;
    
    // Bright particle specks
    color += blue100 * particles;
    
    // Radial gradient glow from center
    float centerGlow = 1.0 - length((uv - 0.5) * vec2(1.6, 1.0)) * 1.4;
    centerGlow = max(centerGlow, 0.0);
    color += blue600 * centerGlow * 0.03;
    
    // Vignette - deeper at edges
    float vignette = 1.0 - length(uv - 0.5) * 1.0;
    vignette = smoothstep(0.0, 0.7, vignette);
    color *= vignette;
    
    // Subtle scanline overlay
    float scanline = sin(uv.y * uResolution.y * 1.5) * 0.5 + 0.5;
    color *= 0.98 + scanline * 0.02;
    
    // Keep overall darkness but with depth
    color = mix(deepBg, color, 0.8);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

function GradientMesh() {
  const meshRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    []
  );

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
      meshRef.current.material.uniforms.uMouse.value.lerp(
        new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
        0.05
      );
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function WebGLBackground() {
  return (
    <div className="fixed inset-0 -z-10 noise-overlay">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
        style={{ position: 'absolute', inset: 0 }}
      >
        <GradientMesh />
      </Canvas>
    </div>
  );
}

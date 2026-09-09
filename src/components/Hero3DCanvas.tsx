import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, Torus, Icosahedron, Octahedron, Box, MeshDistortMaterial, Sparkles, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles as SparklesIcon, Crown, Zap, ShieldCheck, Tent, Tv, Volume2, ArrowRight, Heart } from 'lucide-react';

// --- 1. Interactive Floating 3D Shapes ---

// Golden Distorted Sphere (Centerpiece of Luxury)
const GlowingDistortSphere: React.FC<{ position?: [number, number, number]; scale?: number }> = ({ 
  position = [0, 0, 0], 
  scale = 1.6 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.25;
      meshRef.current.rotation.y += delta * 0.35;
      // Gentle floating pulse
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.15;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={1.2} floatIntensity={1.8}>
      <mesh
        ref={meshRef}
        position={position}
        scale={hovered ? scale * 1.15 : scale}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={hovered ? '#FDE047' : '#F59E0B'}
          emissive="#78350F"
          emissiveIntensity={hovered ? 0.8 : 0.4}
          roughness={0.15}
          metalness={0.85}
          distort={hovered ? 0.55 : 0.38}
          speed={3}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  );
};

// Orbital Gold Ring / Stage Box Truss Representation
const OrbitalRiggingRing: React.FC<{ 
  position?: [number, number, number]; 
  radius?: number; 
  tube?: number; 
  color?: string;
  speed?: number;
}> = ({ 
  position = [0, 0, 0], 
  radius = 2.4, 
  tube = 0.08, 
  color = '#FBBF24',
  speed = 0.6
}) => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * speed * 0.8;
      ringRef.current.rotation.y += delta * speed;
      ringRef.current.rotation.z += delta * speed * 0.5;
    }
  });

  return (
    <mesh ref={ringRef} position={position}>
      <torusGeometry args={[radius, tube, 16, 100]} />
      <meshStandardMaterial 
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.9}
        roughness={0.2}
      />
    </mesh>
  );
};

// Crystalline Floating Gem (Emerald / Cyan Brilliance)
const FloatingCrystalGem: React.FC<{
  position: [number, number, number];
  color: string;
  scale?: number;
  rotationSpeed?: number;
}> = ({ position, color, scale = 0.8, rotationSpeed = 1 }) => {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.5 * rotationSpeed;
      ref.current.rotation.y += delta * 0.8 * rotationSpeed;
    }
  });

  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={2}>
      <mesh
        ref={ref}
        position={position}
        scale={hovered ? scale * 1.25 : scale}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          roughness={0.1}
          metalness={0.2}
          transmission={0.8}
          thickness={1.5}
          ior={1.6}
        />
      </mesh>
    </Float>
  );
};

// Interactive 3D Floating Production Card Badge
const Floating3DBadgeCard: React.FC<{
  position: [number, number, number];
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  accentColor: string;
  badgeBg: string;
  onClick?: () => void;
}> = ({ position, icon, title, subtitle, accentColor, badgeBg, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.4}>
      <group position={position}>
        {/* Invisible 3D backing anchor mesh for accurate raycasting and depth */}
        <Box args={[2.2, 1.2, 0.1]} visible={false} />
        <Html
          center
          distanceFactor={7.5}
          transform
          zIndexRange={[100, 0]}
          className="pointer-events-auto select-none"
        >
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onClick}
            className={`cursor-pointer transition-all duration-300 transform ${
              hovered ? 'scale-110 shadow-2xl -translate-y-1' : 'scale-100 shadow-xl'
            } p-3 sm:p-3.5 rounded-2xl border backdrop-blur-xl ${badgeBg} min-w-[180px] sm:min-w-[210px] flex items-center gap-3 text-white`}
            style={{
              borderColor: hovered ? accentColor : 'rgba(255,255,255,0.2)',
              boxShadow: hovered ? `0 12px 30px -5px ${accentColor}55` : '0 8px 20px rgba(0,0,0,0.5)',
            }}
          >
            <div 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold shrink-0 shadow-inner"
              style={{ backgroundColor: `${accentColor}33`, color: accentColor, border: `1px solid ${accentColor}66` }}
            >
              {icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider block font-['Outfit']" style={{ color: accentColor }}>
                  {subtitle}
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-black tracking-tight text-white truncate font-['Outfit']">
                {title}
              </h4>
            </div>
          </div>
        </Html>
      </group>
    </Float>
  );
};

// Scene Controller to handle interactive mouse parallax smoothly
const InteractiveCameraRig: React.FC = () => {
  const { mouse, camera } = useThree();

  useFrame(() => {
    // Silky smooth camera lerp based on cursor coordinates
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.75, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 0.5, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
};

// Main 3D World Scene
interface Hero3DSceneProps {
  onCardClick?: (target: string) => void;
}

const Hero3DScene: React.FC<Hero3DSceneProps> = ({ onCardClick }) => {
  return (
    <>
      <InteractiveCameraRig />

      {/* Dynamic Lighting setup */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={2.2} color="#FEF08A" />
      <pointLight position={[-6, -4, -2]} intensity={1.5} color="#3B82F6" />
      <pointLight position={[6, 4, 3]} intensity={2.0} color="#F59E0B" />
      <spotLight position={[0, 8, 4]} angle={0.6} penumbra={1} intensity={2.5} color="#FDE047" />

      {/* Floating Glowing Particle Field */}
      <Sparkles
        count={75}
        scale={10}
        size={3.5}
        speed={0.8}
        color="#FDE047"
        opacity={0.8}
      />
      <Sparkles
        count={45}
        scale={12}
        size={2.5}
        speed={0.5}
        color="#60A5FA"
        opacity={0.6}
      />

      {/* Center 3D Glowing Distorted Golden Sphere */}
      <GlowingDistortSphere position={[0, 0.2, 0]} scale={1.45} />

      {/* Orbiting Golden Rigging Rings */}
      <OrbitalRiggingRing radius={2.3} tube={0.06} color="#F59E0B" speed={0.7} />
      <OrbitalRiggingRing radius={2.8} tube={0.04} color="#FDE047" speed={-0.5} />

      {/* Floating Geometric Crystals / Diamonds */}
      <FloatingCrystalGem position={[-2.8, 1.8, -0.5]} color="#10B981" scale={0.65} rotationSpeed={1.2} />
      <FloatingCrystalGem position={[2.9, -1.6, -0.8]} color="#38BDF8" scale={0.7} rotationSpeed={0.9} />
      <FloatingCrystalGem position={[-2.4, -1.9, 0.5]} color="#EC4899" scale={0.55} rotationSpeed={1.5} />
      <FloatingCrystalGem position={[2.7, 1.9, 0.3]} color="#A855F7" scale={0.6} rotationSpeed={1.1} />

      {/* Interactive 3D HTML Floating Feature Cards */}
      <Floating3DBadgeCard
        position={[-2.6, 0.7, 1.2]}
        icon={<Tent className="w-5 h-5 text-amber-300" />}
        title="Mega Marquees"
        subtitle="100 - 5,000+ Guests"
        accentColor="#FBBF24"
        badgeBg="bg-[#0A1628]/85"
        onClick={() => onCardClick?.('tents')}
      />

      <Floating3DBadgeCard
        position={[2.6, 0.9, 1.0]}
        icon={<Tv className="w-5 h-5 text-cyan-300" />}
        title="P2.6 LED Video Walls"
        subtitle="Concert & Stage Rig"
        accentColor="#38BDF8"
        badgeBg="bg-[#071322]/85"
        onClick={() => onCardClick?.('av')}
      />

      <Floating3DBadgeCard
        position={[0, -2.1, 1.4]}
        icon={<Crown className="w-5 h-5 text-yellow-300" />}
        title="We Design Your Dream"
        subtitle="SBL Uganda Official"
        accentColor="#FDE047"
        badgeBg="bg-[#0B1527]/90"
        onClick={() => onCardClick?.('booking')}
      />
    </>
  );
};

// Graceful WebGL Error Boundary wrapper
interface Hero3DCanvasProps {
  onNavigateToBooking?: () => void;
  onNavigateToCategory?: (category: string) => void;
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({
  onNavigateToBooking,
  onNavigateToCategory
}) => {
  const [hasWebGLError, setHasWebGLError] = useState(false);

  const handleCardClick = (target: string) => {
    if (target === 'booking') {
      onNavigateToBooking?.();
    } else {
      onNavigateToCategory?.(target);
    }
  };

  if (hasWebGLError) {
    return null;
  }

  return (
    <div 
      id="hero-3d-interactive-canvas-container"
      className="w-full h-[360px] sm:h-[440px] md:h-[500px] relative pointer-events-auto"
      style={{ touchAction: 'none' }}
    >
      {/* Ambient background glow backdrop */}
      <div className="absolute inset-0 bg-radial from-amber-500/15 via-transparent to-transparent rounded-3xl pointer-events-none filter blur-2xl" />

      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center text-amber-300/80 text-xs font-bold gap-2">
          <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span>Initializing 3D Interactive Stage...</span>
        </div>
      }>
        <Canvas
          camera={{ position: [0, 0, 6.2], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
          onError={() => setHasWebGLError(true)}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <Hero3DScene onCardClick={handleCardClick} />
        </Canvas>
      </Suspense>

      {/* Floating 3D Interaction Prompt Badge */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#050B14]/80 border border-amber-400/30 text-[10px] text-amber-200 font-bold backdrop-blur-md shadow-lg flex items-center gap-1.5 pointer-events-none">
        <SparklesIcon className="w-3 h-3 text-amber-400 animate-pulse" />
        <span>Interactive 3D Stage • Move mouse to inspect</span>
      </div>
    </div>
  );
};

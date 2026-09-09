import React, { useState, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useApp } from '../context/AppContext';
import { getThemeClasses } from '../utils/themeStyles';
import { 
  Sparkles as SparklesIcon, 
  Layers, 
  Calendar, 
  Camera, 
  RotateCw, 
  Sliders, 
  Check, 
  Copy, 
  Maximize2, 
  Users, 
  Zap, 
  Tv, 
  Volume2, 
  Music, 
  Heart, 
  Briefcase, 
  Award,
  Download,
  Info,
  Image as ImageIcon
} from 'lucide-react';
import sblHallStageStockImg from '../assets/images/sbl_hall_stage_stock_1788000989414.jpg';
import sblStageBlueTrussImg from '../assets/images/sbl_stage_blue_truss_1788001016044.jpg';
import sblMegaTentImg from '../assets/images/sbl_mega_tent_1787463878262.jpg';

export type StageBackdrop = 'hall' | 'concert' | 'tent' | 'dark';

export type StageType = 'wedding' | 'concert' | 'corporate' | 'gala';
export type LightingMood = 'gold' | 'romantic' | 'concert' | 'daylight';
export type StageSize = 'standard' | 'grand' | 'arena';

interface StagePreset {
  id: StageType;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  description: string;
  defaultMood: LightingMood;
  guestCapacity: string;
  dimensions: {
    standard: string;
    grand: string;
    arena: string;
  };
  recommendedInventory: string[];
}

const STAGE_PRESETS: Record<StageType, StagePreset> = {
  wedding: {
    id: 'wedding',
    name: 'Royal Wedding & Kwanjula Pavilion',
    subtitle: 'Bridal Dais, Floral Runway & Romantic Lighting',
    icon: <Heart className="w-4 h-4 text-pink-400" />,
    description: 'Designed for bespoke bridal ceremonies, introduction functions (Kwanjula), and luxurious wedding receptions with floral arches and romantic amber glow.',
    defaultMood: 'romantic',
    guestCapacity: '300 – 1,200 Guests',
    dimensions: {
      standard: '24ft W × 16ft D (Height: 3.5ft)',
      grand: '36ft W × 20ft D (Height: 4.0ft)',
      arena: '48ft W × 24ft D (Height: 4.5ft)',
    },
    recommendedInventory: [
      'Heavy-duty aluminium elevated stage deck with white skirting',
      'Ceremonial floral arch with warm amber fairy lighting',
      'Curved 6m × 3m P2.6 LED Video Wall for bridal monograms',
      '12× LED Par Warm Amber & Blush uplights',
      'Low-fog heavy dry ice effect for bridal first dance',
      'High-fidelity distributed acoustic sound system & wireless lapel mics',
    ],
  },
  concert: {
    id: 'concert',
    name: 'Mega Concert & Festival Truss Rig',
    subtitle: 'Heavy Box Truss, Moving Heads & Line Array',
    icon: <Music className="w-4 h-4 text-amber-400" />,
    description: 'Heavy structural box truss roof rig engineered for high-energy concerts, music festivals, crusade rallies, and live stadium events.',
    defaultMood: 'concert',
    guestCapacity: '1,000 – 10,000+ Guests',
    dimensions: {
      standard: '32ft W × 20ft D (Height: 4.5ft)',
      grand: '44ft W × 28ft D (Height: 5.0ft)',
      arena: '60ft W × 36ft D (Height: 6.0ft)',
    },
    recommendedInventory: [
      'Aluminium box truss ground support tower system (12m height)',
      '16× Beam 230W Computerized Moving Head Lights',
      'Main Center 8m × 4m P2.6 High-Definition LED Screen',
      'Dual 4m × 2.5m Side IMAG Relay Video Screens',
      'Flown Dual 8-Box Line Array System with 8× Dual 18" Subwoofers',
      '100kVA Ultra-Silent Backup Diesel Generator',
    ],
  },
  corporate: {
    id: 'corporate',
    name: 'Executive Summit & Corporate Keynote',
    subtitle: 'Branded Presentation Stage & Glass Lectern',
    icon: <Briefcase className="w-4 h-4 text-blue-400" />,
    description: 'Crisp, professional staging tailored for national conferences, international summits, product launches, and AGM corporate gatherings.',
    defaultMood: 'gold',
    guestCapacity: '250 – 2,500 Guests',
    dimensions: {
      standard: '28ft W × 14ft D (Height: 3.0ft)',
      grand: '38ft W × 18ft D (Height: 3.5ft)',
      arena: '50ft W × 22ft D (Height: 4.0ft)',
    },
    recommendedInventory: [
      'Matte charcoal finished stage platform with ramp accessibility',
      'Ultrawide Seamless 10m × 3m P2.6 Presentation LED Screen',
      'Frosted acrylic presidential speech lectern with dual gooseneck mics',
      'Executive studio cool-white wash keylighting for clear videography',
      'Confidence monitors for keynote presenters & wireless clickers',
      'Multi-channel digital audio console with auto-feedback suppression',
    ],
  },
  gala: {
    id: 'gala',
    name: 'Imperial Awards Night & Banquet Stage',
    subtitle: 'Red Carpet Dais, Golden Pedestals & VIP Ambiance',
    icon: <Award className="w-4 h-4 text-yellow-400" />,
    description: 'Glamorous presentation stage for milestone anniversaries, sports awards, fundraising galas, and VIP corporate banquets.',
    defaultMood: 'gold',
    guestCapacity: '200 – 1,000 Guests',
    dimensions: {
      standard: '24ft W × 16ft D (Height: 3.5ft)',
      grand: '36ft W × 20ft D (Height: 4.0ft)',
      arena: '48ft W × 24ft D (Height: 4.5ft)',
    },
    recommendedInventory: [
      'Lustrous red carpet stage surface with polished brass stanchions',
      'Starcloth black twinkle backdrop with moving logo spotlights',
      'Golden mirror-finish award trophy presentation pedestals',
      '8× Beam pinspots focused on VIP table centerpieces',
      'P2.6 LED screen with live camera feeds and nominee graphics',
      'Chamber music acoustic tuning & wireless handheld microphones',
    ],
  },
};

const LIGHTING_CONFIGS: Record<LightingMood, {
  name: string;
  ambientColor: string;
  primaryLight: string;
  beamColor1: string;
  beamColor2: string;
  glowColor: string;
}> = {
  gold: {
    name: 'Imperial Amber & Gold',
    ambientColor: '#2B1A0A',
    primaryLight: '#FBBF24',
    beamColor1: '#F59E0B',
    beamColor2: '#FEF08A',
    glowColor: '#F59E0B',
  },
  romantic: {
    name: 'Romantic Rose & Champagne',
    ambientColor: '#260B1E',
    primaryLight: '#FDA4AF',
    beamColor1: '#EC4899',
    beamColor2: '#F43F5E',
    glowColor: '#EC4899',
  },
  concert: {
    name: 'Electric Sapphire & Cyan',
    ambientColor: '#071833',
    primaryLight: '#38BDF8',
    beamColor1: '#2563EB',
    beamColor2: '#06B6D4',
    glowColor: '#38BDF8',
  },
  daylight: {
    name: 'Crisp Crystal Daylight',
    ambientColor: '#1A2233',
    primaryLight: '#FFFFFF',
    beamColor1: '#E2E8F0',
    beamColor2: '#93C5FD',
    glowColor: '#FFFFFF',
  },
};

// --- 3D Scene Components ---

// Elevated 3D Staging Deck with Beveled Edge & Skirt
const StagePlatform: React.FC<{ 
  stageType: StageType; 
  stageSize: StageSize;
  lighting: typeof LIGHTING_CONFIGS['gold'];
}> = ({ stageType, stageSize, lighting }) => {
  const sizeMultiplier = stageSize === 'arena' ? 1.4 : stageSize === 'grand' ? 1.15 : 1.0;
  const width = 6 * sizeMultiplier;
  const depth = 3.6 * sizeMultiplier;
  const height = 0.5;

  const carpetColor = useMemo(() => {
    switch (stageType) {
      case 'wedding': return '#F1F5F9'; // Pure White Bridal
      case 'gala': return '#991B1B';    // Royal Red Carpet
      case 'corporate': return '#1E293B'; // Executive Slate
      case 'concert': return '#0F172A';   // Concert Obsidian
      default: return '#1E293B';
    }
  }, [stageType]);

  return (
    <group position={[0, -0.2, 0]}>
      {/* Main Elevated Deck */}
      <mesh position={[0, height / 2, 0]} receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={carpetColor}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Stage Front Skirting (Metallic Trim) */}
      <mesh position={[0, height / 2, depth / 2 + 0.02]}>
        <boxGeometry args={[width + 0.05, height, 0.04]} />
        <meshStandardMaterial 
          color="#0B1322" 
          metalness={0.8} 
          roughness={0.2} 
        />
      </mesh>

      {/* Front Steps */}
      <mesh position={[0, height / 4, depth / 2 + 0.35]} receiveShadow>
        <boxGeometry args={[1.8, height / 2, 0.6]} />
        <meshStandardMaterial color={carpetColor} roughness={0.5} />
      </mesh>

      {/* Floor Glow Accent Strip */}
      <mesh position={[0, 0.02, depth / 2 + 0.04]}>
        <boxGeometry args={[width * 0.95, 0.03, 0.04]} />
        <meshBasicMaterial color={lighting.beamColor1} />
      </mesh>
    </group>
  );
};

// Overhead Aluminium Box Truss Rig
const AluminiumTrussRig: React.FC<{ stageSize: StageSize }> = ({ stageSize }) => {
  const sizeMultiplier = stageSize === 'arena' ? 1.4 : stageSize === 'grand' ? 1.15 : 1.0;
  const width = 6.4 * sizeMultiplier;
  const height = 3.8;
  const depth = 3.6 * sizeMultiplier;

  return (
    <group position={[0, 0, 0]}>
      {/* Top Cross Beam Truss */}
      <mesh position={[0, height, -depth / 3]}>
        <boxGeometry args={[width, 0.18, 0.18]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Front Top Truss */}
      <mesh position={[0, height, depth / 3]}>
        <boxGeometry args={[width, 0.18, 0.18]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Left Vertical Tower */}
      <mesh position={[-width / 2, height / 2, -depth / 3]}>
        <boxGeometry args={[0.18, height, 0.18]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Right Vertical Tower */}
      <mesh position={[width / 2, height / 2, -depth / 3]}>
        <boxGeometry args={[0.18, height, 0.18]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
};

// Center LED Video Wall Backdrop
const LEDVideoScreen: React.FC<{ stageType: StageType; lighting: typeof LIGHTING_CONFIGS['gold'] }> = ({ stageType, lighting }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle pulse to simulate active dynamic LED content
      const t = state.clock.getElapsedTime();
      const intensity = 0.85 + Math.sin(t * 2) * 0.1;
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
  });

  const screenTitle = useMemo(() => {
    switch (stageType) {
      case 'wedding': return '💖 SBL ROYAL BRIDAL';
      case 'concert': return '⚡ SBL LIVE TOUR';
      case 'corporate': return '🌐 SBL GLOBAL SUMMIT';
      case 'gala': return '🏆 ANNUAL EXCELLENCE GALA';
      default: return 'SBL EVENTS UGANDA';
    }
  }, [stageType]);

  return (
    <group position={[0, 1.8, -1.3]}>
      {/* Screen Frame Bezel */}
      <mesh>
        <boxGeometry args={[4.4, 2.4, 0.1]} />
        <meshStandardMaterial color="#050B14" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Active Glowing LED Panel Face */}
      <mesh ref={meshRef} position={[0, 0, 0.06]}>
        <planeGeometry args={[4.2, 2.2]} />
        <meshStandardMaterial
          color="#051329"
          emissive={lighting.beamColor1}
          emissiveIntensity={0.9}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      {/* 3D High-Res HTML Label on Screen */}
      <Html position={[0, 0, 0.1]} center transform distanceFactor={6} className="pointer-events-none select-none">
        <div className="w-[320px] h-[170px] flex flex-col items-center justify-center p-3 text-center bg-radial from-white/15 via-transparent to-black/80 rounded-xl border border-white/20 backdrop-blur-xs">
          <div className="text-[10px] uppercase font-black tracking-widest text-amber-300 drop-shadow-md">
            P2.6 High-Definition LED
          </div>
          <div className="text-base font-black text-white tracking-wider mt-1 drop-shadow-lg font-['Outfit']">
            {screenTitle}
          </div>
          <div className="text-[9px] text-white/80 mt-1 font-semibold">
            We Design Your Dream • SBL Uganda
          </div>
        </div>
      </Html>
    </group>
  );
};

// Moving Head Fixtures with Volumetric Light Cones
const MovingHeadBeams: React.FC<{ lighting: typeof LIGHTING_CONFIGS['gold']; stageType: StageType }> = ({ lighting }) => {
  const beamGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (beamGroupRef.current) {
      const t = state.clock.getElapsedTime();
      // Gentle sweeping beam motion
      beamGroupRef.current.children.forEach((child, idx) => {
        child.rotation.z = Math.sin(t * 1.5 + idx * 0.8) * 0.25;
        child.rotation.x = Math.cos(t * 1.2 + idx * 0.5) * 0.15;
      });
    }
  });

  const positions: [number, number, number][] = [
    [-2.2, 3.6, 0.4],
    [-1.1, 3.6, 0.4],
    [0, 3.6, 0.4],
    [1.1, 3.6, 0.4],
    [2.2, 3.6, 0.4],
  ];

  return (
    <group ref={beamGroupRef}>
      {positions.map((pos, idx) => (
        <group key={idx} position={pos}>
          {/* Light Head Body */}
          <mesh>
            <cylinderGeometry args={[0.08, 0.1, 0.2, 16]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Luminous Light Cone projecting onto stage */}
          <mesh position={[0, -1.4, 0]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.6, 2.8, 24, 1, true]} />
            <meshBasicMaterial
              color={idx % 2 === 0 ? lighting.beamColor1 : lighting.beamColor2}
              transparent
              opacity={0.35}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          {/* Light Source Spot */}
          <pointLight
            color={idx % 2 === 0 ? lighting.beamColor1 : lighting.beamColor2}
            intensity={1.5}
            distance={4}
          />
        </group>
      ))}
    </group>
  );
};

// Dual Flown Line Array PA Speakers
const LineArraySpeakers: React.FC<{ stageSize: StageSize }> = ({ stageSize }) => {
  const sizeMultiplier = stageSize === 'arena' ? 1.4 : stageSize === 'grand' ? 1.15 : 1.0;
  const xOffset = 3.2 * sizeMultiplier;

  return (
    <group>
      {/* Left Speaker Tower */}
      <group position={[-xOffset, 2.2, 0.4]}>
        {[0, 0.3, 0.6, 0.9].map((y, i) => (
          <mesh key={i} position={[0, -y, 0]} rotation={[0.05 * i, 0.15, 0]}>
            <boxGeometry args={[0.45, 0.22, 0.35]} />
            <meshStandardMaterial color="#0A0F1D" roughness={0.4} metalness={0.6} />
          </mesh>
        ))}
        {/* Ground Subwoofer */}
        <mesh position={[0, -2.0, 0]}>
          <boxGeometry args={[0.6, 0.7, 0.6]} />
          <meshStandardMaterial color="#060B14" roughness={0.5} metalness={0.5} />
        </mesh>
      </group>

      {/* Right Speaker Tower */}
      <group position={[xOffset, 2.2, 0.4]}>
        {[0, 0.3, 0.6, 0.9].map((y, i) => (
          <mesh key={i} position={[0, -y, 0]} rotation={[0.05 * i, -0.15, 0]}>
            <boxGeometry args={[0.45, 0.22, 0.35]} />
            <meshStandardMaterial color="#0A0F1D" roughness={0.4} metalness={0.6} />
          </mesh>
        ))}
        {/* Ground Subwoofer */}
        <mesh position={[0, -2.0, 0]}>
          <boxGeometry args={[0.6, 0.7, 0.6]} />
          <meshStandardMaterial color="#060B14" roughness={0.5} metalness={0.5} />
        </mesh>
      </group>
    </group>
  );
};

// Custom Stage Decor according to Event Preset
const StageDecorations: React.FC<{ stageType: StageType; lighting: typeof LIGHTING_CONFIGS['gold'] }> = ({ stageType }) => {
  switch (stageType) {
    case 'wedding':
      // Floral Arch & Bridal Dais
      return (
        <group position={[0, 0.2, -0.2]}>
          {/* Floral Archway */}
          <mesh position={[0, 1.4, 0]}>
            <torusGeometry args={[1.3, 0.1, 16, 50, Math.PI]} />
            <meshStandardMaterial color="#FDE047" metalness={0.4} roughness={0.3} />
          </mesh>
          {/* Bridal Couple Throne / Love Seat */}
          <mesh position={[0, 0.4, -0.3]}>
            <boxGeometry args={[1.4, 0.6, 0.6]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.9, -0.55]}>
            <boxGeometry args={[1.4, 0.7, 0.15]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
        </group>
      );

    case 'corporate':
      // Acrylic Lectern & Confidence Monitors
      return (
        <group position={[0, 0.2, 0.6]}>
          {/* Lectern */}
          <mesh position={[-0.8, 0.5, 0]}>
            <boxGeometry args={[0.45, 1.0, 0.35]} />
            <meshPhysicalMaterial 
              color="#CBD5E1" 
              transmission={0.8} 
              roughness={0.1} 
              ior={1.5} 
            />
          </mesh>
          {/* Stage Confidence Monitor */}
          <mesh position={[0.8, 0.1, 0.4]} rotation={[-0.4, 0, 0]}>
            <boxGeometry args={[0.5, 0.35, 0.08]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
        </group>
      );

    case 'gala':
      // Golden Award Pedestals
      return (
        <group position={[0, 0.2, 0.4]}>
          {[-0.8, 0, 0.8].map((x, i) => (
            <mesh key={i} position={[x, 0.45, 0]}>
              <cylinderGeometry args={[0.2, 0.25, 0.9, 24]} />
              <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.15} />
            </mesh>
          ))}
        </group>
      );

    case 'concert':
    default:
      // Center DJ Booth / Band Riser
      return (
        <group position={[0, 0.2, 0]}>
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[1.6, 0.8, 0.6]} />
            <meshStandardMaterial color="#091322" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      );
  }
};

// Complete 3D World Wrapper
const Stage3DScene: React.FC<{
  stageType: StageType;
  stageSize: StageSize;
  lightingMood: LightingMood;
  autoRotate: boolean;
}> = ({ stageType, stageSize, lightingMood, autoRotate }) => {
  const lighting = LIGHTING_CONFIGS[lightingMood];

  return (
    <>
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={autoRotate}
        autoRotateSpeed={0.8}
        minDistance={4}
        maxDistance={14}
        maxPolarAngle={Math.PI / 2 - 0.05} // Do not go below floor
        target={[0, 1.2, 0]}
      />

      {/* Global Lighting System */}
      <ambientLight intensity={0.65} color={lighting.ambientColor} />
      <directionalLight
        position={[4, 8, 5]}
        intensity={1.8}
        color={lighting.primaryLight}
        castShadow
      />
      <pointLight position={[-4, 4, 3]} intensity={1.2} color={lighting.beamColor1} />
      <pointLight position={[4, 4, -3]} intensity={1.0} color={lighting.beamColor2} />

      {/* Floating Sparkles & Dust Particles */}
      <Sparkles
        count={50}
        scale={8}
        size={2.5}
        speed={0.6}
        color={lighting.glowColor}
        opacity={0.6}
      />

      {/* Stage Components */}
      <StagePlatform stageType={stageType} stageSize={stageSize} lighting={lighting} />
      <AluminiumTrussRig stageSize={stageSize} />
      <LEDVideoScreen stageType={stageType} lighting={lighting} />
      <MovingHeadBeams lighting={lighting} stageType={stageType} />
      <LineArraySpeakers stageSize={stageSize} />
      <StageDecorations stageType={stageType} lighting={lighting} />

      {/* Floor Ground Grid */}
      <gridHelper args={[20, 20, '#1E293B', '#0F172A']} position={[0, -0.21, 0]} />
    </>
  );
};

// --- Main Exported Component ---
export const Interactive3DStagePlanner: React.FC<{
  onBookStage?: (preset: StagePreset, size: StageSize, mood: LightingMood) => void;
}> = ({ onBookStage }) => {
  const { theme, openBookingModal, showToast } = useApp();
  const t = getThemeClasses(theme);

  const [selectedType, setSelectedType] = useState<StageType>('wedding');
  const [selectedSize, setSelectedSize] = useState<StageSize>('grand');
  const [selectedMood, setSelectedMood] = useState<LightingMood>('romantic');
  const [backdropType, setBackdropType] = useState<StageBackdrop>('hall');
  const [autoRotate, setAutoRotate] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [webGLError, setWebGLError] = useState(false);

  const backdropImages: Record<StageBackdrop, string | null> = {
    hall: sblHallStageStockImg,
    concert: sblStageBlueTrussImg,
    tent: sblMegaTentImg,
    dark: null,
  };

  const activePreset = STAGE_PRESETS[selectedType];
  const activeLighting = LIGHTING_CONFIGS[selectedMood];

  const handleSelectType = (type: StageType) => {
    setSelectedType(type);
    setSelectedMood(STAGE_PRESETS[type].defaultMood);
  };

  const handleBookCurrentSetup = () => {
    if (onBookStage) {
      onBookStage(activePreset, selectedSize, selectedMood);
    } else {
      openBookingModal();
      showToast(
        'Stage Plan Applied!',
        `Custom 3D ${activePreset.name} (${selectedSize.toUpperCase()}) added to your event request.`,
        'success'
      );
    }
  };

  const handleCopySpecs = () => {
    const specs = `SBL Events 3D Stage Specifications:
Preset: ${activePreset.name}
Stage Size: ${selectedSize.toUpperCase()} (${activePreset.dimensions[selectedSize]})
Lighting Ambiance: ${activeLighting.name}
Capacity: ${activePreset.guestCapacity}
Recommended Gear:
${activePreset.recommendedInventory.map(item => `• ${item}`).join('\n')}
Booking Reference: SBL-STAGE-${Date.now().toString().slice(-6)}`;

    navigator.clipboard?.writeText(specs);
    setIsCopied(true);
    showToast('Stage Specs Copied!', 'All technical rigging and gear specs copied to clipboard.', 'info');
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div id="interactive-3d-stage-planner" className="w-full space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold mb-2">
            <SparklesIcon className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Interactive 3D Event Stage Planner & Visualizer</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight">
            Design Your 3D Stage & Production Setup
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Simulate elevated decks, box truss rigging, P2.6 LED screens, moving beams, and guest capacities in real-time.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              autoRotate 
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' 
                : 'bg-white/10 text-slate-300 border-white/15 hover:bg-white/20 hover:text-white'
            }`}
            title="Toggle 360° Auto Rotation"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>{autoRotate ? 'Rotating' : 'Paused'}</span>
          </button>

          <button
            onClick={handleCopySpecs}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Copy Technical Specifications"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Copy Specs'}</span>
          </button>

          <button
            onClick={handleBookCurrentSetup}
            className={`${t.primaryBtn} px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-lg`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book This Setup</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Top: 3D WebGL Canvas Stage */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-[#060D1A] to-[#020710] shadow-2xl">
            {/* 3D Screen Background Venue Image */}
            {backdropImages[backdropType] ? (
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <img
                  src={backdropImages[backdropType]!}
                  alt="3D Screen Event Background"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-125 saturate-110 scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020710] via-black/40 to-[#060D1A]/75" />
                <div 
                  className="absolute inset-0 transition-colors duration-700 opacity-30 filter blur-2xl"
                  style={{ backgroundColor: activeLighting.glowColor }}
                />
              </div>
            ) : (
              /* Ambient Background Glow */
              <div 
                className="absolute inset-0 pointer-events-none transition-colors duration-700 opacity-20 filter blur-3xl"
                style={{ backgroundColor: activeLighting.glowColor }}
              />
            )}

            {!webGLError ? (
              <Suspense fallback={
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-3 text-amber-300">
                  <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-bold">Constructing 3D Aluminium Stage Rig...</span>
                </div>
              }>
                <Canvas
                  camera={{ position: [0, 3.2, 7.8], fov: 45 }}
                  gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                  dpr={[1, 1.5]}
                  onError={() => setWebGLError(true)}
                  className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing"
                >
                  <Stage3DScene
                    stageType={selectedType}
                    stageSize={selectedSize}
                    lightingMood={selectedMood}
                    autoRotate={autoRotate}
                  />
                </Canvas>
              </Suspense>
            ) : (
              <div className="relative z-10 w-full h-full flex items-center justify-center text-slate-400 text-xs p-6 text-center">
                WebGL is restricted on this browser. Use the controls below to configure and request your stage equipment.
              </div>
            )}

            {/* Overlaid Live Badges */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
                {activePreset.icon}
                <span>{activePreset.name}</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-400/20 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[11px] font-bold shadow-lg">
                {activePreset.dimensions[selectedSize]}
              </span>
            </div>

            {/* Top Right: Backdrop Background Switcher */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1 p-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 shadow-lg">
              <span className="text-[10px] font-bold text-slate-400 px-2 flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">Venue:</span>
              </span>
              {(['hall', 'concert', 'tent', 'dark'] as StageBackdrop[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setBackdropType(mode)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize transition-all cursor-pointer ${
                    backdropType === mode
                      ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Bottom 3D Inspection Prompt */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/15 text-[11px] text-slate-300 pointer-events-none flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Drag to rotate • Scroll to zoom • Right-click to pan</span>
            </div>
          </div>

          {/* Preset Selector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(STAGE_PRESETS) as StageType[]).map((type) => {
              const preset = STAGE_PRESETS[type];
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  onClick={() => handleSelectType(type)}
                  className={`p-3 rounded-2xl border transition-all text-left flex flex-col gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400/20 border-amber-400 text-white shadow-lg ring-1 ring-amber-400/50'
                      : 'bg-white/5 border-white/10 hover:border-white/30 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-1.5 rounded-lg bg-white/10">
                      {preset.icon}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                  <span className="font-bold text-xs line-clamp-1">{preset.name.split(' ')[0]} {preset.name.split(' ')[1]}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1">{preset.guestCapacity}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Stage Configurations & SBL Equipment Specs */}
        <div className="lg:col-span-4 space-y-4">
          {/* Configuration Card */}
          <div className={`${t.cardBg} p-5 rounded-3xl border ${t.cardBorder} shadow-xl space-y-4`}>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white flex items-center gap-2 font-['Outfit']">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Rigging & Production Controls</span>
              </h3>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-300">
                Live Specs
              </span>
            </div>

            {/* Stage Size Selector */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">
                1. Stage Footprint & Dimensions:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['standard', 'grand', 'arena'] as StageSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border ${
                      selectedSize === size
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-black'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-amber-300/90 mt-1.5 font-medium">
                Dimensions: {activePreset.dimensions[selectedSize]}
              </p>
            </div>

            {/* Lighting Mood Selector */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">
                2. Intelligent Lighting Ambiance:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(LIGHTING_CONFIGS) as LightingMood[]).map((mood) => {
                  const cfg = LIGHTING_CONFIGS[mood];
                  const isSelected = selectedMood === mood;
                  return (
                    <button
                      key={mood}
                      onClick={() => setSelectedMood(mood)}
                      className={`p-2 rounded-xl text-xs text-left border transition-all flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-white/15 border-white text-white font-bold shadow-md'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span 
                        className="w-3 h-3 rounded-full border border-white/30 shrink-0" 
                        style={{ backgroundColor: cfg.primaryLight }} 
                      />
                      <span className="truncate">{cfg.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Logistics & Inventory Breakdown */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>Audience Capacity:</span>
                </span>
                <span className="text-amber-300">{activePreset.guestCapacity}</span>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-300 block">
                  Recommended SBL Equipment Package:
                </span>
                <ul className="space-y-1">
                  {activePreset.recommendedInventory.map((item, idx) => (
                    <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                      <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleBookCurrentSetup}
              className={`${t.primaryBtn} w-full py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-xl cursor-pointer mt-2`}
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve This Stage Configuration</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

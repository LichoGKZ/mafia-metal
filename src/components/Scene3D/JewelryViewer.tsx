"use client";

import { Suspense, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Float,
  MeshDistortMaterial,
  Sphere,
  Torus,
  Box,
  Cylinder,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";


function RingModel({
  color = "#D4AF37",
  roughness = 0.05,
  metalness = 1,
}: {
  color?: string;
  roughness?: number;
  metalness?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y =
      state.clock.elapsedTime * 0.5 + mouse.x * 0.3;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1 + mouse.y * 0.2;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <group>
      <Torus
        ref={ref}
        args={[1, 0.28, 64, 128]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
          envMapIntensity={2.5}
        />
      </Torus>
      {/* Gem on ring */}
      <mesh position={[0, 0, 1.1]} castShadow>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0}
          metalness={0.1}
          transparent
          opacity={0.9}
          envMapIntensity={4}
        />
      </mesh>
    </group>
  );
}

function ChainModel({
  color = "#C0C0C0",
}: {
  color?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y =
      state.clock.elapsedTime * 0.3 + mouse.x * 0.4;
    groupRef.current.rotation.x = mouse.y * 0.2;
    groupRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
  });

  const links = [];
  for (let i = 0; i < 7; i++) {
    links.push(
      <Torus
        key={i}
        args={[0.28, 0.07, 16, 32]}
        position={[0, i * 0.52 - 1.56, 0]}
        rotation={[i % 2 === 0 ? Math.PI / 2 : 0, 0, 0]}
        castShadow
      >
        <meshStandardMaterial
          color={color}
          roughness={0.05}
          metalness={1}
          envMapIntensity={2}
        />
      </Torus>
    );
  }

  return <group ref={groupRef}>{links}</group>;
}

function CrossModel({
  color = "#1a1a1a",
}: {
  color?: string;
}) {
  const ref = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y =
      state.clock.elapsedTime * 0.4 + mouse.x * 0.5;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    ref.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.7) * 0.08;
  });

  return (
    <group ref={ref}>
      {/* Vertical bar */}
      <Box args={[0.2, 1.6, 0.08]} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial
          color={color}
          roughness={0.1}
          metalness={1}
          envMapIntensity={3}
        />
      </Box>
      {/* Horizontal bar */}
      <Box args={[1.0, 0.2, 0.08]} position={[0, 0.3, 0]} castShadow>
        <meshStandardMaterial
          color={color}
          roughness={0.1}
          metalness={1}
          envMapIntensity={3}
        />
      </Box>
      {/* Center gem */}
      <mesh position={[0, 0.3, 0.08]} castShadow>
        <octahedronGeometry args={[0.14, 0]} />
        <meshStandardMaterial
          color="#8B0000"
          roughness={0.05}
          metalness={0.2}
          envMapIntensity={3}
          emissive="#3a0000"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}

function SignetModel({ color = "#D4AF37" }: { color?: string }) {
  const ref = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y =
      state.clock.elapsedTime * 0.45 + mouse.x * 0.35;
    ref.current.rotation.x = mouse.y * 0.15;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.07;
  });

  return (
    <group ref={ref}>
      {/* Ring band */}
      <Torus args={[0.85, 0.22, 32, 128]} castShadow>
        <meshStandardMaterial
          color={color}
          roughness={0.04}
          metalness={1}
          envMapIntensity={2.8}
        />
      </Torus>
      {/* Signet face */}
      <Box args={[0.7, 0.5, 0.12]} position={[0, 0, 0.88]} castShadow>
        <meshStandardMaterial
          color={color}
          roughness={0.04}
          metalness={1}
          envMapIntensity={2.8}
        />
      </Box>
    </group>
  );
}

function BraceletModel({ color = "#C0C0C0" }: { color?: string }) {
  const ref = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y =
      state.clock.elapsedTime * 0.35 + mouse.x * 0.4;
    ref.current.rotation.x = mouse.y * 0.2;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.06;
  });

  const segments = [];
  const count = 12;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const r = 1.0;
    segments.push(
      <Box
        key={i}
        args={[0.35, 0.18, 0.18]}
        position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}
        rotation={[0, -angle, 0]}
        castShadow
      >
        <meshStandardMaterial
          color={i % 3 === 0 ? "#D4AF37" : color}
          roughness={0.06}
          metalness={1}
          envMapIntensity={2}
        />
      </Box>
    );
  }

  return <group ref={ref}>{segments}</group>;
}

function PendantModel({ color = "#D4AF37" }: { color?: string }) {
  const ref = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y =
      state.clock.elapsedTime * 0.5 + mouse.x * 0.4;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <group ref={ref}>
      <Sphere args={[0.7, 32, 32]} castShadow>
        <meshStandardMaterial
          color={color}
          roughness={0.05}
          metalness={1}
          envMapIntensity={2.5}
        />
      </Sphere>
      <Cylinder args={[0.08, 0.08, 0.4, 16]} position={[0, 0.95, 0]}>
        <meshStandardMaterial
          color={color}
          roughness={0.05}
          metalness={1}
          envMapIntensity={2}
        />
      </Cylinder>
      {/* Facets overlay */}
      <mesh castShadow>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshStandardMaterial
          color={color}
          roughness={0.02}
          metalness={1}
          envMapIntensity={3}
          wireframe={false}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}



function GLBModel({ url, color }: { url: string; color?: string }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y =
      state.clock.elapsedTime * 0.4 + mouse.x * 0.3;
    ref.current.rotation.x = mouse.y * 0.15;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.06;
  });

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      (mesh.material as THREE.MeshStandardMaterial).envMapIntensity = 2;
      (mesh.material as THREE.MeshStandardMaterial).metalness = 1;
      (mesh.material as THREE.MeshStandardMaterial).roughness = 0.1;
      if (color) {
        (mesh.material as THREE.MeshStandardMaterial).color.set(color);
      }
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });

  return <primitive ref={ref} object={scene} />;
}

// ── Particle System ───────────────────────────────────────────────────────────

function MetallicParticles({ count = 80 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);

  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    sizes[i] = Math.random() * 0.04 + 0.01;
  }

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.04;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#D4AF37"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ── Lighting Setup ────────────────────────────────────────────────────────────

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.2} color="#1a1a1a" />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        color="#D4AF37"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      <directionalLight
        position={[-5, 3, -5]}
        intensity={0.8}
        color="#C0C0C0"
      />
      <pointLight position={[0, 3, 0]} intensity={1} color="#D4AF37" distance={10} />
      <pointLight position={[3, -2, 3]} intensity={0.5} color="#8B0000" distance={8} />
    </>
  );
}


type ModelType = "ring" | "chain" | "cross" | "signet" | "bracelet" | "pendant";

function getModelComponent(type: ModelType, color: string) {
  switch (type) {
    case "ring":
      return <RingModel color={color} />;
    case "chain":
      return <ChainModel color={color} />;
    case "cross":
      return <CrossModel color={color} />;
    case "signet":
      return <SignetModel color={color} />;
    case "bracelet":
      return <BraceletModel color={color} />;
    case "pendant":
      return <PendantModel color={color} />;
    default:
      return <RingModel color={color} />;
  }
}

// ── Main JewelryViewer ────────────────────────────────────────────────────────

export interface JewelryViewerProps {
  modelType?: ModelType;
  modelUrl?: string;
  color?: string;
  height?: number | string;
  particles?: boolean;
  shadows?: boolean;
  autoRotate?: boolean;
  zoom?: boolean;
  environmentPreset?:
    | "sunset"
    | "dawn"
    | "night"
    | "warehouse"
    | "forest"
    | "apartment"
    | "studio"
    | "city"
    | "park"
    | "lobby";
  className?: string;
}

export default function JewelryViewer({
  modelType = "ring",
  modelUrl,
  color = "#D4AF37",
  height = 400,
  particles = true,
  shadows = true,
  autoRotate = true,
  zoom = true,
  environmentPreset = "studio",
  className = "",
}: JewelryViewerProps) {
  return (
    <div
      className={`w-full relative ${className}`}
      style={{ height }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        shadows={shadows}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <Lighting />

          <Environment preset={environmentPreset} />

          <Float
            speed={1.5}
            rotationIntensity={0.2}
            floatIntensity={0.3}
            enabled={!autoRotate}
          >
            {modelUrl ? (
              <GLBModel url={modelUrl} color={color} />
            ) : (
              getModelComponent(modelType, color)
            )}
          </Float>

          {particles && <MetallicParticles count={60} />}

          {shadows && (
            <ContactShadows
              position={[0, -2, 0]}
              opacity={0.5}
              scale={6}
              blur={2.5}
              far={3}
              color="#000000"
            />
          )}

          <OrbitControls
            enableZoom={zoom}
            enablePan={false}
            enableRotate={true}
            minDistance={2.5}
            maxDistance={8}
            autoRotate={false}
            dampingFactor={0.08}
            enableDamping
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

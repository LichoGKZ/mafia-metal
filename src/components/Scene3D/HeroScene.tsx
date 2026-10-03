"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshDistortMaterial,
  Sphere,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";
import { GOLD_HEX } from "@/lib/brand";

function FloatingRing() {
  const ref = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.3 + mouse.x * 0.5;
    ref.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.4) * 0.15 + mouse.y * 0.3;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.12;
  });

  return (
    <mesh ref={ref} castShadow>
      <torusGeometry args={[1.2, 0.34, 64, 128]} />
      <meshStandardMaterial
        color={GOLD_HEX}
        roughness={0.04}
        metalness={1}
        envMapIntensity={3}
      />
    </mesh>
  );
}

function GoldSphere() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.15;
    ref.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <Sphere ref={ref} args={[0.4, 64, 64]} position={[2.5, 0.8, -1]}>
      <MeshDistortMaterial
        color={GOLD_HEX}
        roughness={0.05}
        metalness={1}
        distort={0.2}
        speed={1.5}
        envMapIntensity={2}
      />
    </Sphere>
  );
}

function SilverOrb() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * -0.2;
    ref.current.rotation.z = state.clock.elapsedTime * 0.1;
    ref.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.5 + 1) * 0.15;
  });

  return (
    <Sphere ref={ref} args={[0.28, 32, 32]} position={[-2.6, -0.6, -0.8]}>
      <MeshDistortMaterial
        color="#C0C0C0"
        roughness={0.06}
        metalness={1}
        distort={0.15}
        speed={2}
        envMapIntensity={2}
      />
    </Sphere>
  );
}

function MetallicParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 200;

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
  }

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    pointsRef.current.rotation.x = state.clock.elapsedTime * 0.008;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color={GOLD_HEX}
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function DynamicLights() {
  const light1 = useRef<THREE.PointLight>(null);
  const light2 = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (light1.current) {
      light1.current.position.x =
        Math.sin(state.clock.elapsedTime * 0.7) * 4;
      light1.current.position.z =
        Math.cos(state.clock.elapsedTime * 0.5) * 3;
    }
    if (light2.current) {
      light2.current.position.x =
        Math.cos(state.clock.elapsedTime * 0.4) * 3;
      light2.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.6) * 2;
    }
  });

  return (
    <>
      <pointLight
        ref={light1}
        position={[3, 2, 2]}
        intensity={2}
        color={GOLD_HEX}
        distance={8}
      />
      <pointLight
        ref={light2}
        position={[-3, -1, 1]}
        intensity={1.2}
        color="#8B0000"
        distance={6}
      />
      <ambientLight intensity={0.15} color="#111111" />
      <directionalLight
        position={[0, 5, 3]}
        intensity={1.5}
        color="#ffffff"
      />
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <DynamicLights />
        <Environment preset="studio" />

        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
          <FloatingRing />
        </Float>

        <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.4}>
          <GoldSphere />
        </Float>

        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
          <SilverOrb />
        </Float>

        <MetallicParticleField />

        <Stars
          radius={50}
          depth={50}
          count={300}
          factor={2}
          saturation={0}
          fade
          speed={0.5}
        />
      </Suspense>
    </Canvas>
  );
}

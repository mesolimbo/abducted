import React from 'react';

// --- VISUAL EFFECTS ---

export const HatchingPattern = () => (
  <svg width="0" height="0" className="absolute">
    <defs>
      <pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="4" stroke="#2c1c11" strokeWidth="1" />
      </pattern>
      <pattern id="crosshatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="4" stroke="#2c1c11" strokeWidth="1" />
        <line x1="0" y1="0" x2="4" y2="0" stroke="#2c1c11" strokeWidth="1" />
      </pattern>
      <filter id="rough-paper">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
        <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="2">
          <feDistantLight azimuth="45" elevation="60" />
        </feDiffuseLighting>
      </filter>
    </defs>
  </svg>
);

export const Vignette = () => (
    <div className="absolute inset-0 pointer-events-none" 
         style={{ background: 'radial-gradient(circle, transparent 50%, rgba(44,28,17,0.4) 100%)' }}>
    </div>
);

// --- SCENERY ASSETS ---

export const Cloud = ({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <path
      d="M25,60 Q40,30 65,50 Q80,20 110,50 Q130,40 140,70 Q160,80 150,110 Q140,140 100,130 Q60,150 40,120 Q10,130 10,90 Q5,70 25,60 Z"
      fill="#fff"
      stroke="#2c1c11"
      strokeWidth="2"
      className="drop-shadow-sm"
    />
    {/* Internal hatching detailing */}
    <path
      d="M35,90 Q50,110 90,105 M110,80 Q120,90 130,95"
      fill="none"
      stroke="#2c1c11"
      strokeWidth="1"
      strokeDasharray="2,2"
    />
  </g>
);

export const Sky = ({ width }: { width: number }) => (
  <div className="absolute inset-0 opacity-40 pointer-events-none">
      <Cloud x={100} y={50} scale={0.8} />
      <Cloud x={width - 200} y={150} scale={1.2} />
      <Cloud x={width / 2} y={80} scale={0.6} />
  </div>
);

export const Ground = () => (
    <div className="w-full h-full relative overflow-hidden">
        {/* Grass Tuits */}
        <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-8 absolute -top-8 left-0">
             <path d="M0,10 L2,5 L5,10 L8,2 L12,10 L15,4 L20,10 L100,10 Z" fill="#2c1c11" />
        </svg>
        <div className="w-full h-full bg-[#2c1c11]"></div>
    </div>
);

// --- ENTITY ASSETS ---

export const Barn = ({ width, height }: { width: number; height: number }) => (
  <svg width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
    {/* Main Body */}
    <rect x="10" y="40" width="80" height="60" fill="white" stroke="#2c1c11" strokeWidth="2" />
    {/* Roof */}
    <path d="M5,40 L50,5 L95,40" fill="white" stroke="#2c1c11" strokeWidth="2" />
    {/* Wood planks (hatching) */}
    <path d="M10,40 L90,40 M10,50 L90,50 M10,60 L90,60 M10,70 L90,70 M10,80 L90,80 M10,90 L90,90" stroke="#2c1c11" strokeWidth="1" />
    {/* Door */}
    <rect x="35" y="60" width="30" height="40" fill="#2c1c11" />
    <path d="M35,60 L65,100 M65,60 L35,100" stroke="white" strokeWidth="1" />
  </svg>
);

export const Silo = ({ width, height }: { width: number; height: number }) => (
  <svg width={width} height={height} viewBox="0 0 60 100" preserveAspectRatio="none" className="overflow-visible">
    {/* Dome */}
    <path d="M5,20 Q30,-5 55,20" fill="white" stroke="#2c1c11" strokeWidth="2" />
    {/* Body */}
    <rect x="5" y="20" width="50" height="80" fill="white" stroke="#2c1c11" strokeWidth="2" />
    {/* Metal rings */}
    {[30, 40, 50, 60, 70, 80, 90].map((y) => (
      <line key={y} x1="5" y1={y} x2="55" y2={y} stroke="#2c1c11" strokeWidth="1" />
    ))}
    {/* Shading lines on the side */}
    <path d="M45,20 L45,100 M50,20 L50,100" stroke="#2c1c11" strokeWidth="0.5" />
  </svg>
);

export const Cow = () => (
  <svg width="40" height="30" viewBox="0 0 40 30" className="animate-wiggle">
    <g transform="scale(1, 1)">
      {/* Body */}
      <path d="M5,10 Q10,5 25,5 Q35,5 38,15 Q38,25 25,25 Q10,25 5,20 Z" fill="#fff" stroke="#2c1c11" strokeWidth="1.5" />
      {/* Head */}
      <path d="M2,12 Q-2,15 2,18 Q4,20 6,15 Z" fill="#2c1c11" />
      {/* Legs */}
      <line x1="10" y1="25" x2="10" y2="30" stroke="#2c1c11" strokeWidth="1.5" />
      <line x1="15" y1="25" x2="15" y2="30" stroke="#2c1c11" strokeWidth="1.5" />
      <line x1="25" y1="25" x2="25" y2="30" stroke="#2c1c11" strokeWidth="1.5" />
      <line x1="30" y1="25" x2="30" y2="30" stroke="#2c1c11" strokeWidth="1.5" />
      {/* Spots */}
      <circle cx="15" cy="15" r="3" fill="#2c1c11" />
      <circle cx="28" cy="12" r="2" fill="#2c1c11" />
    </g>
  </svg>
);

export const Ufo = ({ isThrusting }: { isThrusting: boolean }) => (
  <div className="relative w-32 h-16">
    <svg viewBox="0 0 120 60" className="w-full h-full overflow-visible drop-shadow-lg">
        {/* Beam (only visible when thrusting, creates the connection to cow) */}
        <path 
            d="M45,50 L20,200 L100,200 L75,50 Z" 
            fill="url(#hatch)" 
            opacity="0.3" 
            className="animate-pulse"
        />

        {/* Dome */}
        <path d="M40,25 Q60,-5 80,25" fill="#fff" stroke="#2c1c11" strokeWidth="2" />
        <path d="M45,25 Q60,5 75,25" fill="none" stroke="#2c1c11" strokeWidth="0.5" />

        {/* Saucer Body */}
        <ellipse cx="60" cy="30" rx="55" ry="15" fill="#2c1c11" />
        <ellipse cx="60" cy="27" rx="55" ry="15" fill="#fff" stroke="#2c1c11" strokeWidth="2" />

        {/* Rim Details */}
        <path d="M15,27 Q60,45 105,27" fill="none" stroke="#2c1c11" strokeWidth="1" />
        
        {/* Lights */}
        <circle cx="25" cy="32" r="3" fill={isThrusting ? "#ffeb3b" : "#fff"} stroke="#2c1c11" />
        <circle cx="45" cy="38" r="3" fill={isThrusting ? "#ffeb3b" : "#fff"} stroke="#2c1c11" />
        <circle cx="60" cy="40" r="3" fill={isThrusting ? "#ffeb3b" : "#fff"} stroke="#2c1c11" />
        <circle cx="75" cy="38" r="3" fill={isThrusting ? "#ffeb3b" : "#fff"} stroke="#2c1c11" />
        <circle cx="95" cy="32" r="3" fill={isThrusting ? "#ffeb3b" : "#fff"} stroke="#2c1c11" />
    </svg>
  </div>
);
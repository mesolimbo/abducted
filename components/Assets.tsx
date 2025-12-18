// This file now provides raw SVG strings for Phaser to load as textures
export const ASSET_SVGS = {
  ufo: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60">
        <path d="M40,25 Q60,-5 80,25" fill="#fff" stroke="#2c1c11" stroke-width="2" />
        <ellipse cx="60" cy="30" rx="55" ry="15" fill="#2c1c11" />
        <ellipse cx="60" cy="27" rx="55" ry="15" fill="#fff" stroke="#2c1c11" stroke-width="2" />
        <circle cx="25" cy="32" r="3" fill="#fff" stroke="#2c1c11" />
        <circle cx="45" cy="38" r="3" fill="#fff" stroke="#2c1c11" />
        <circle cx="60" cy="40" r="3" fill="#fff" stroke="#2c1c11" />
        <circle cx="75" cy="38" r="3" fill="#fff" stroke="#2c1c11" />
        <circle cx="95" cy="32" r="3" fill="#fff" stroke="#2c1c11" />
    </svg>`,
  ufo_thrust: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60">
        <path d="M40,25 Q60,-5 80,25" fill="#fff" stroke="#2c1c11" stroke-width="2" />
        <ellipse cx="60" cy="30" rx="55" ry="15" fill="#2c1c11" />
        <ellipse cx="60" cy="27" rx="55" ry="15" fill="#fff" stroke="#2c1c11" stroke-width="2" />
        <circle cx="25" cy="32" r="3" fill="#ffeb3b" stroke="#2c1c11" />
        <circle cx="45" cy="38" r="3" fill="#ffeb3b" stroke="#2c1c11" />
        <circle cx="60" cy="40" r="3" fill="#ffeb3b" stroke="#2c1c11" />
        <circle cx="75" cy="38" r="3" fill="#ffeb3b" stroke="#2c1c11" />
        <circle cx="95" cy="32" r="3" fill="#ffeb3b" stroke="#2c1c11" />
    </svg>`,
  cow: `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="30" viewBox="0 0 40 30">
      <path d="M5,10 Q10,5 25,5 Q35,5 38,15 Q38,25 25,25 Q10,25 5,20 Z" fill="#fff" stroke="#2c1c11" stroke-width="1.5" />
      <path d="M2,12 Q-2,15 2,18 Q4,20 6,15 Z" fill="#2c1c11" />
      <line x1="10" y1="25" x2="10" y2="30" stroke="#2c1c11" stroke-width="1.5" />
      <line x1="15" y1="25" x2="15" y2="30" stroke="#2c1c11" stroke-width="1.5" />
      <line x1="25" y1="25" x2="25" y2="30" stroke="#2c1c11" stroke-width="1.5" />
      <line x1="30" y1="25" x2="30" y2="30" stroke="#2c1c11" stroke-width="1.5" />
      <circle cx="15" cy="15" r="3" fill="#2c1c11" />
      <circle cx="28" cy="12" r="2" fill="#2c1c11" />
    </svg>`,
  barn: `
    <svg xmlns="http://www.w3.org/2000/svg" width="140" height="120" viewBox="0 0 100 100" preserveAspectRatio="none">
      <rect x="10" y="40" width="80" height="60" fill="white" stroke="#2c1c11" stroke-width="2" />
      <path d="M5,40 L50,5 L95,40" fill="white" stroke="#2c1c11" stroke-width="2" />
      <rect x="35" y="60" width="30" height="40" fill="#2c1c11" />
      <path d="M35,60 L65,100 M65,60 L35,100" stroke="white" stroke-width="1" />
    </svg>`,
  silo: `
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="250" viewBox="0 0 60 100" preserveAspectRatio="none">
      <path d="M5,20 Q30,-5 55,20" fill="white" stroke="#2c1c11" stroke-width="2" />
      <rect x="5" y="20" width="50" height="80" fill="white" stroke="#2c1c11" stroke-width="2" />
      <line x1="5" y1="30" x2="55" y2="30" stroke="#2c1c11" stroke-width="1" />
      <line x1="5" y1="40" x2="55" y2="40" stroke="#2c1c11" stroke-width="1" />
      <line x1="5" y1="50" x2="55" y2="50" stroke="#2c1c11" stroke-width="1" />
      <line x1="5" y1="60" x2="55" y2="60" stroke="#2c1c11" stroke-width="1" />
      <line x1="5" y1="70" x2="55" y2="70" stroke="#2c1c11" stroke-width="1" />
      <line x1="5" y1="80" x2="55" y2="80" stroke="#2c1c11" stroke-width="1" />
      <line x1="5" y1="90" x2="55" y2="90" stroke="#2c1c11" stroke-width="1" />
    </svg>`,
  ground: `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="80" viewBox="0 0 100 80">
      <rect width="100" height="80" fill="#2c1c11" />
      <path d="M0,10 L2,5 L5,10 L8,2 L12,10 L15,4 L20,10 L25,2 L30,10 L40,5 L50,10 L60,2 L70,10 L80,5 L90,10 L100,5" fill="#2c1c11" transform="translate(0, -10)" />
    </svg>`,
  beam: `
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="200" viewBox="0 0 80 200">
       <defs>
        <pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="#2c1c11" stroke-width="1" />
        </pattern>
      </defs>
      <path d="M25,0 L0,200 L80,200 L55,0 Z" fill="url(#hatch)" opacity="0.3" />
    </svg>`,
  cloud: `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="150" viewBox="0 0 160 150">
      <path d="M25,60 Q40,30 65,50 Q80,20 110,50 Q130,40 140,70 Q160,80 150,110 Q140,140 100,130 Q60,150 40,120 Q10,130 10,90 Q5,70 25,60 Z" fill="#fff" stroke="#2c1c11" stroke-width="2" />
    </svg>`,
  explosion: `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <path d="M50,10 L55,40 L85,20 L65,50 L95,60 L60,65 L75,95 L50,70 L25,95 L40,65 L5,60 L35,50 L15,20 L45,40 Z" fill="none" stroke="#2c1c11" stroke-width="3" />
      <circle cx="50" cy="55" r="10" fill="#2c1c11" />
    </svg>`,
  splat: `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <path d="M50,20 Q60,10 70,25 Q90,15 85,45 Q95,65 75,75 Q65,95 40,85 Q15,95 10,65 Q5,35 30,25 Q20,5 50,20" fill="#991b1b" />
      <circle cx="35" cy="40" r="4" fill="#991b1b" />
      <circle cx="65" cy="65" r="5" fill="#991b1b" />
      <circle cx="20" cy="70" r="3" fill="#991b1b" />
      <circle cx="75" cy="30" r="3" fill="#991b1b" />
    </svg>`
};

export const getSvgDataUri = (svgString: string) => {
    return 'data:image/svg+xml;base64,' + btoa(svgString.trim());
};
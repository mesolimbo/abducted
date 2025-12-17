import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  GAME_SPEED, 
  GRAVITY, 
  THRUST, 
  MAX_FUEL, 
  FUEL_CONSUMPTION, 
  FUEL_RECHARGE, 
  CHARGE_HEIGHT_THRESHOLD,
  SPAWN_RATE,
  GameState,
  Obstacle,
  ObstacleType
} from './utils/gameConstants';
import { STRINGS } from './utils/strings';
import { HatchingPattern, Ufo, Cow, Barn, Silo, Sky, Ground, Vignette } from './components/Assets';

const App: React.FC = () => {
  // Screen dimensions
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Game State
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // Physics State (using refs for smooth loop)
  const ufoPos = useRef({ y: dimensions.height / 2, velocity: 0 });
  const obstacles = useRef<Obstacle[]>([]);
  const fuel = useRef(MAX_FUEL);
  const frameId = useRef(0);
  const spawnTimer = useRef(0);
  const groundOffset = useRef(0);
  
  // Input State
  const isThrusting = useRef(false);

  // Constants derived from dimensions
  const GROUND_HEIGHT = 80; // Height of the ground bar
  const PLAYABLE_HEIGHT = dimensions.height - GROUND_HEIGHT;
  const UFO_X = dimensions.width * 0.15; // UFO horizontal position
  const UFO_WIDTH = 120;
  const COW_OFFSET_Y = 120; // How far below UFO the cow hangs
  const COW_SIZE = 30;

  // Handle Resize
  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Controls
  const handleInputStart = () => { isThrusting.current = true; };
  const handleInputEnd = () => { isThrusting.current = false; };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.code === 'Space') handleInputStart(); };
    const handleKeyUp = (e: KeyboardEvent) => { if (e.code === 'Space') handleInputEnd(); };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleInputStart);
    window.addEventListener('mouseup', handleInputEnd);
    window.addEventListener('touchstart', handleInputStart);
    window.addEventListener('touchend', handleInputEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleInputStart);
      window.removeEventListener('mouseup', handleInputEnd);
      window.removeEventListener('touchstart', handleInputStart);
      window.removeEventListener('touchend', handleInputEnd);
    };
  }, []);

  // Core Game Loop
  const loop = useCallback(() => {
    if (gameState !== GameState.PLAYING) return;

    // 1. Update UFO Physics
    if (isThrusting.current && fuel.current > 0) {
      ufoPos.current.velocity += THRUST;
      fuel.current = Math.max(0, fuel.current - FUEL_CONSUMPTION);
    } else {
      ufoPos.current.velocity += GRAVITY;
    }

    ufoPos.current.y += ufoPos.current.velocity;

    // Cap velocity
    ufoPos.current.velocity = Math.max(-10, Math.min(10, ufoPos.current.velocity));

    // Floor/Ceiling Collision
    // The "Cow" hits the floor, not the UFO
    const cowBottomY = ufoPos.current.y + COW_OFFSET_Y + COW_SIZE;
    
    // Ceiling check
    if (ufoPos.current.y < 0) {
        ufoPos.current.y = 0;
        ufoPos.current.velocity = 0;
    }

    // Ground check (Cow touches grass)
    if (cowBottomY > PLAYABLE_HEIGHT) {
        ufoPos.current.y = PLAYABLE_HEIGHT - COW_OFFSET_Y - COW_SIZE;
        ufoPos.current.velocity = 0;
    }

    // 2. Fuel Recharge Logic
    // If the cow is low enough (grazing), recharge fuel
    const distFromGround = PLAYABLE_HEIGHT - cowBottomY;
    if (distFromGround < CHARGE_HEIGHT_THRESHOLD && !isThrusting.current) {
        fuel.current = Math.min(MAX_FUEL, fuel.current + FUEL_RECHARGE);
    }

    // 3. Spawning Obstacles
    spawnTimer.current++;
    if (spawnTimer.current > SPAWN_RATE) {
        spawnTimer.current = 0;
        const type: ObstacleType = Math.random() > 0.5 ? 'BARN' : 'SILO';
        const height = type === 'BARN' ? 120 : 250; 
        const width = type === 'BARN' ? 140 : 80;
        
        obstacles.current.push({
            id: Date.now(),
            x: dimensions.width,
            type,
            height,
            width,
            passed: false
        });
    }

    // 4. Update Obstacles & Ground
    groundOffset.current = (groundOffset.current + GAME_SPEED) % 100;
    
    obstacles.current.forEach(obs => {
        obs.x -= GAME_SPEED;
    });

    // Remove off-screen obstacles
    obstacles.current = obstacles.current.filter(obs => obs.x + obs.width > -100);

    // 5. Collision Detection
    // Simple AABB collision between Cow and Obstacle
    // Note: The player loses if the COW hits the building
    const cowRect = {
        l: UFO_X + UFO_WIDTH/2 - 20, // Approx center alignment
        r: UFO_X + UFO_WIDTH/2 + 20,
        t: ufoPos.current.y + COW_OFFSET_Y,
        b: ufoPos.current.y + COW_OFFSET_Y + COW_SIZE
    };

    obstacles.current.forEach(obs => {
        const obsRect = {
            l: obs.x + 10, // slight forgiveness padding
            r: obs.x + obs.width - 10,
            t: PLAYABLE_HEIGHT - obs.height + 10,
            b: PLAYABLE_HEIGHT
        };

        if (
            cowRect.l < obsRect.r &&
            cowRect.r > obsRect.l &&
            cowRect.t < obsRect.b &&
            cowRect.b > obsRect.t
        ) {
            handleGameOver();
        }

        // Score counting
        if (!obs.passed && obs.x + obs.width < cowRect.l) {
            obs.passed = true;
            setScore(s => s + 1);
        }
    });

    frameId.current = requestAnimationFrame(loop);
  }, [gameState, dimensions, PLAYABLE_HEIGHT]);

  const handleGameOver = () => {
    cancelAnimationFrame(frameId.current);
    setGameState(GameState.GAME_OVER);
    if (score > highScore) setHighScore(score);
  };

  const startGame = () => {
    setGameState(GameState.PLAYING);
    setScore(0);
    ufoPos.current = { y: dimensions.height * 0.3, velocity: 0 };
    obstacles.current = [];
    fuel.current = MAX_FUEL;
    spawnTimer.current = 0;
  };

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
        frameId.current = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(frameId.current);
  }, [gameState, loop]);

  // Force a re-render for UI updates (fuel gauge) roughly every 60ms to avoid thrashing React
  const [, setTick] = useState(0);
  useEffect(() => {
    if (gameState !== GameState.PLAYING) return;
    const interval = setInterval(() => setTick(t => t + 1), 100);
    return () => clearInterval(interval);
  }, [gameState]);


  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#f3e6d0] select-none touch-none">
      <HatchingPattern />
      
      <Sky width={dimensions.width} />

      {/* Game World Container */}
      <div className="absolute inset-0 pointer-events-none">
        
        {/* Obstacles */}
        {obstacles.current.map(obs => (
            <div 
                key={obs.id} 
                className="absolute bottom-[80px]"
                style={{ 
                    left: obs.x, 
                    width: obs.width, 
                    height: obs.height 
                }}
            >
                {obs.type === 'BARN' ? 
                    <Barn width={obs.width} height={obs.height} /> : 
                    <Silo width={obs.width} height={obs.height} />
                }
            </div>
        ))}

        {/* Player Entity */}
        <div 
            className="absolute z-20"
            style={{ 
                left: UFO_X, 
                top: ufoPos.current.y,
                width: UFO_WIDTH,
                height: 400, // Tall container for UFO + Beam + Cow
            }}
        >
            {/* UFO Top */}
            <Ufo isThrusting={isThrusting.current && fuel.current > 0} />
            
            {/* Cow hanging in beam */}
            <div 
                className="absolute left-1/2 transform -translate-x-1/2 transition-transform duration-100"
                style={{ top: COW_OFFSET_Y }}
            >
                <Cow />
            </div>
        </div>

        {/* Ground */}
        <div 
            className="absolute bottom-0 left-0 w-full z-30"
            style={{ height: GROUND_HEIGHT }}
        >
           <Ground />
        </div>
      </div>

      <Vignette />

      {/* UI Layer */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-40 font-serif">
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-widest uppercase ink-text">{STRINGS.SCORE_PREFIX}{score}</h1>
            <p className="text-sm italic opacity-75 text-[#2c1c11]">{STRINGS.HIGH_SCORE_PREFIX}{highScore}</p>
        </div>

        {/* Fuel Gauge */}
        <div className="flex flex-col items-center gap-1 w-48">
            <span className="text-sm font-bold uppercase tracking-widest ink-text">{STRINGS.FUEL_LABEL}</span>
            <div className="w-full h-4 border-2 border-[#2c1c11] bg-white relative p-[2px]">
                <div 
                    className="h-full bg-[#2c1c11] transition-all duration-100 ease-linear"
                    style={{ width: `${fuel.current}%` }}
                ></div>
            </div>
            {fuel.current < 20 && (
                <span className="text-xs text-red-700 font-bold animate-pulse">{STRINGS.FUEL_WARNING}</span>
            )}
            {fuel.current > 20 && fuel.current < 100 && (
                <span className="text-xs text-[#2c1c11] opacity-60">{STRINGS.FUEL_NORMAL}</span>
            )}
        </div>
      </div>

      {/* Start / Game Over Screens */}
      {gameState === GameState.START && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-[#f3e6d0]/80 backdrop-blur-sm">
            <div className="text-center p-8 border-4 border-[#2c1c11] max-w-md bg-[#f3e6d0] shadow-2xl relative">
                <div className="absolute top-2 left-2 right-2 bottom-2 border border-[#2c1c11] opacity-50 pointer-events-none"></div>
                <h1 className="text-6xl font-black mb-4 ink-text uppercase leading-none">{STRINGS.TITLE}</h1>
                <h2 className="text-2xl italic mb-6 border-b-2 border-[#2c1c11] inline-block pb-2">{STRINGS.SUBTITLE}</h2>
                <p className="mb-8 font-serif text-lg leading-relaxed">
                    {STRINGS.INSTRUCTIONS.PILOT} <strong className="border-b border-[#2c1c11]">{STRINGS.INSTRUCTIONS.KEY_SPACE}</strong> {STRINGS.INSTRUCTIONS.OR} <strong className="border-b border-[#2c1c11]">{STRINGS.INSTRUCTIONS.TOUCH}</strong>.
                    <br/><br/>
                    {STRINGS.INSTRUCTIONS.GOAL}
                    <br/>
                    <span className="font-bold italic">{STRINGS.INSTRUCTIONS.FUEL_RULE}</span>
                </p>
                <button 
                    onClick={startGame}
                    className="px-8 py-3 bg-[#2c1c11] text-[#f3e6d0] font-bold text-xl uppercase tracking-widest hover:bg-[#4a3b2a] transition-colors shadow-lg"
                >
                    {STRINGS.BTN_START}
                </button>
            </div>
        </div>
      )}

      {gameState === GameState.GAME_OVER && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-[#2c1c11]/90 backdrop-blur-sm">
            <div className="text-center p-8 border-4 border-[#f3e6d0] max-w-md bg-[#f3e6d0] shadow-2xl">
                <h2 className="text-5xl font-black mb-2 ink-text uppercase">{STRINGS.GAME_OVER_TITLE}</h2>
                <p className="text-xl mb-6">{STRINGS.GAME_OVER_DESC}</p>
                <p className="text-3xl font-bold mb-8">{STRINGS.SCORE_PREFIX}{score}</p>
                <button 
                    onClick={startGame}
                    className="px-8 py-3 bg-[#2c1c11] text-[#f3e6d0] font-bold text-xl uppercase tracking-widest hover:bg-[#4a3b2a] transition-colors"
                >
                    {STRINGS.BTN_RETRY}
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;
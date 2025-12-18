import React, { useEffect, useState, useRef } from 'react';
import { 
  GAME_SPEED, 
  GRAVITY, 
  THRUST, 
  MAX_FUEL, 
  FUEL_CONSUMPTION, 
  FUEL_RECHARGE, 
  SPAWN_RATE,
  GameState,
} from './utils/gameConstants.ts';
import { STRINGS } from './utils/strings.ts';
import { ASSET_SVGS, getSvgDataUri } from './components/Assets.tsx';

declare const Phaser: any;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [fuel, setFuel] = useState(MAX_FUEL);
  const gameRef = useRef<any>(null);
  
  const gameStateRef = useRef<GameState>(GameState.START);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    const phaserInstance = (window as any).Phaser;
    if (gameRef.current || !phaserInstance) return;

    class GameScene extends phaserInstance.Scene {
      player: any;
      cow: any;
      beam: any;
      ground: any;
      obstacles: any;
      clouds: any;
      currentFuel: number = MAX_FUEL;
      currentScore: number = 0;
      spawnTimer: number = 0;
      lastUiUpdate: number = 0;
      
      introPhase: number = 0;
      spaceKey: any;

      constructor() {
        super('GameScene');
      }

      preload() {
        this.load.image('ufo', getSvgDataUri(ASSET_SVGS.ufo));
        this.load.image('ufo_thrust', getSvgDataUri(ASSET_SVGS.ufo_thrust));
        this.load.image('cow', getSvgDataUri(ASSET_SVGS.cow));
        this.load.image('barn', getSvgDataUri(ASSET_SVGS.barn));
        this.load.image('silo', getSvgDataUri(ASSET_SVGS.silo));
        this.load.image('ground', getSvgDataUri(ASSET_SVGS.ground));
        this.load.image('beam', getSvgDataUri(ASSET_SVGS.beam));
        this.load.image('cloud', getSvgDataUri(ASSET_SVGS.cloud));
      }

      create() {
        const { width, height } = this.scale;
        
        this.clouds = this.add.group();
        this.obstacles = this.physics.add.group();

        for(let i=0; i<3; i++) {
           this.clouds.create(phaserInstance.Math.Between(0, width), phaserInstance.Math.Between(50, 200), 'cloud')
             .setAlpha(0.3)
             .setScale(phaserInstance.Math.FloatBetween(0.5, 1));
        }

        // Ground
        this.ground = this.add.tileSprite(width/2, height - 40, width, 80, 'ground');
        this.physics.add.existing(this.ground, true);
        
        // Setup initial buildings
        const startingBarn = this.obstacles.create(width * 0.6, height - 80, 'barn');
        startingBarn.setOrigin(0.5, 1);
        startingBarn.body.setAllowGravity(false);

        // Single beam instance
        this.beam = this.add.image(0, 0, 'beam').setOrigin(0.5, 0).setVisible(false);

        // Player (UFO)
        this.player = this.physics.add.sprite(-300, -300, 'ufo');
        this.player.setScale(0.22); 
        this.player.setCollideWorldBounds(true);
        this.player.body.setAllowGravity(false);
        this.player.body.setSize(this.player.width * 0.7, this.player.height * 0.4);

        // Cow
        this.cow = this.physics.add.sprite(width * 0.15, height - 100, 'cow');
        this.cow.setScale(0.6);
        this.cow.body.setAllowGravity(false);
        this.cow.body.setSize(this.cow.width * 0.8, this.cow.height * 0.8);

        // Collision logic
        const onFatalCollision = () => {
          if (gameStateRef.current === GameState.PLAYING) {
            this.events.emit('internal-game-over');
          }
        };

        this.physics.add.overlap(this.cow, this.obstacles, onFatalCollision);
        this.physics.add.overlap(this.player, this.obstacles, onFatalCollision);
        this.physics.add.collider(this.player, this.ground, onFatalCollision);
        
        this.physics.add.overlap(this.player, this.cow, () => {
          const dist = phaserInstance.Math.Distance.Between(this.player.x, this.player.y, this.cow.x, this.cow.y);
          if (dist < 40 && gameStateRef.current === GameState.PLAYING) {
             onFatalCollision();
          }
        });

        this.spaceKey = this.input.keyboard.addKey(phaserInstance.Input.Keyboard.KeyCodes.SPACE);
        this.input.activePointer.isDown = false;

        this.events.on('internal-game-over', () => {
           this.scene.pause();
           setGameState(GameState.GAME_OVER);
        });
      }

      update(time: number, delta: number) {
        const { height, width } = this.scale;

        if (gameStateRef.current === GameState.INTRO) {
          this.handleIntro(delta, width, height);
          return;
        }

        if (gameStateRef.current !== GameState.PLAYING) return;

        const isCurrentlyThrusting = this.spaceKey.isDown || this.input.activePointer.isDown;
        const groundY = height - 80;

        if (isCurrentlyThrusting) {
          if (this.currentFuel > 0) {
            this.player.body.velocity.y += THRUST * 50;
            
            // Calculate altitude-based penalty
            const altitude = Math.max(0, groundY - this.player.y);
            const altitudeMultiplier = 1 + (altitude / height) * 2.8; 
            
            this.currentFuel = Math.max(0, this.currentFuel - (FUEL_CONSUMPTION * altitudeMultiplier));
            this.player.setTexture('ufo_thrust');
          } else {
            this.player.setTexture('ufo');
          }
        } else {
          this.player.setTexture('ufo');
          this.currentFuel = Math.min(MAX_FUEL, this.currentFuel + FUEL_RECHARGE);
        }

        // Positions: Separation increased to 200px (further away as requested)
        const targetCowY = this.player.y + 200;
        this.cow.x = this.player.x;
        // Cow sits slightly higher on ground (origin is center, feet are 9px down)
        this.cow.y = Math.min(groundY - 9, targetCowY);

        this.beam.x = this.player.x;
        this.beam.y = this.player.y + 5;
        // Beam extends to cow's feet (cow center + half height offset)
        this.beam.displayHeight = Math.max(0, (this.cow.y + 9) - this.beam.y);
        this.beam.setVisible(true);

        this.ground.tilePositionX += GAME_SPEED;
        this.clouds.children.iterate((c: any) => {
          c.x -= GAME_SPEED * 0.2;
          if (c.x < -100) c.x = width + 100;
        });

        this.spawnTimer += delta;
        if (this.spawnTimer > SPAWN_RATE * 16.6) {
          this.spawnTimer = 0;
          const type = Math.random() > 0.5 ? 'barn' : 'silo';
          const obs = this.obstacles.create(width + 150, height - 80, type);
          obs.setOrigin(0.5, 1);
          obs.body.setAllowGravity(false);
          obs.body.velocity.x = -GAME_SPEED * 60;
          obs.passed = false;
        }

        this.obstacles.children.iterate((obs: any) => {
          if (obs && !obs.passed && obs.x < this.cow.x) {
            obs.passed = true;
            this.currentScore++;
          }
          if (obs && obs.x < -150) {
            obs.destroy();
          } else if (obs) {
            obs.body.velocity.x = -GAME_SPEED * 60;
          }
        });

        if (time > this.lastUiUpdate + 100) {
          setFuel(Math.round(this.currentFuel));
          setScore(this.currentScore);
          this.lastUiUpdate = time;
        }
      }

      handleIntro(delta: number, width: number, height: number) {
        const targetX = width * 0.15;
        const targetY = height * 0.25;

        if (this.introPhase === 0) {
          const dx = targetX - this.player.x;
          const dy = targetY - this.player.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist > 5) {
            this.player.x += dx * 0.05;
            this.player.y += dy * 0.05;
          } else {
            this.player.x = targetX;
            this.player.y = targetY;
            this.introPhase = 1;
            this.beam.setVisible(true);
          }
        } else if (this.introPhase === 1) {
          this.beam.x = this.player.x;
          this.beam.y = this.player.y + 5;
          
          // Use same separation for intro consistency
          const targetCowY = this.player.y + 200;
          if (this.cow.y > targetCowY) {
            this.cow.y -= 2.5;
            // Beam extends to feet even during intro lift
            this.beam.displayHeight = (this.cow.y + 9) - this.beam.y;
          } else {
            this.cow.y = targetCowY;
            this.introPhase = 2;
          }
        } else if (this.introPhase === 2) {
          this.input.activePointer.isDown = false;
          this.player.body.setAllowGravity(true);
          this.player.body.setGravityY(GRAVITY * 1000);
          setGameState(GameState.PLAYING);
          this.introPhase = 0;
        }
      }
    }

    const config = {
      type: phaserInstance.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: 'game-container',
      backgroundColor: '#f3e6d0',
      transparent: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: GameScene
    };

    gameRef.current = new phaserInstance.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  const handleStart = () => {
    if (gameRef.current && gameRef.current.scene) {
      const scene = gameRef.current.scene.getScene('GameScene');
      if (scene) {
        scene.currentFuel = MAX_FUEL;
        scene.currentScore = 0;
        scene.introPhase = 0;
        scene.scene.restart();
        setGameState(GameState.INTRO);
        setScore(0);
        setFuel(MAX_FUEL);
      }
    }
  };

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#f3e6d0] select-none">
      <div id="game-container" className="absolute inset-0 z-10" />

      <div className="absolute inset-0 pointer-events-none z-20" 
           style={{ background: 'radial-gradient(circle, transparent 50%, rgba(44,28,17,0.3) 100%)' }}>
      </div>

      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-40 font-serif text-[#2c1c11]">
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-widest uppercase ink-text leading-tight">{STRINGS.SCORE_PREFIX}{score}</h1>
            <p className="text-sm italic opacity-75">{STRINGS.HIGH_SCORE_PREFIX}{highScore}</p>
        </div>

        <div className="flex flex-col items-center gap-1 w-48">
            <span className="text-sm font-bold uppercase tracking-widest ink-text">{STRINGS.FUEL_LABEL}</span>
            <div className="w-full h-4 border-2 border-[#2c1c11] bg-white relative p-[2px]">
                <div 
                    className={`h-full transition-all duration-100 ease-linear ${fuel < 30 ? 'bg-red-800' : 'bg-[#2c1c11]'}`}
                    style={{ width: `${fuel}%` }}
                ></div>
            </div>
            {fuel < 20 && (
                <span className="text-xs text-red-700 font-bold animate-pulse uppercase tracking-tighter">{STRINGS.FUEL_WARNING}</span>
            )}
        </div>
      </div>

      {gameState === GameState.START && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-[#f3e6d0]/80 backdrop-blur-sm">
            <div className="text-center p-8 border-4 border-[#2c1c11] max-w-md bg-[#f3e6d0] shadow-2xl relative">
                <div className="absolute top-2 left-2 right-2 bottom-2 border border-[#2c1c11] opacity-50 pointer-events-none"></div>
                <h1 className="text-6xl font-black mb-4 ink-text uppercase leading-none">{STRINGS.TITLE}</h1>
                <h2 className="text-2xl italic mb-6 border-b-2 border-[#2c1c11] inline-block pb-2">{STRINGS.SUBTITLE}</h2>
                <p className="mb-8 font-serif text-lg leading-relaxed text-[#2c1c11]">
                    {STRINGS.INSTRUCTIONS.PILOT} <strong className="border-b border-[#2c1c11]">{STRINGS.INSTRUCTIONS.KEY_SPACE}</strong> {STRINGS.INSTRUCTIONS.OR} <strong className="border-b border-[#2c1c11]">{STRINGS.INSTRUCTIONS.TOUCH}</strong>.
                    <br/><br/>
                    {STRINGS.INSTRUCTIONS.GOAL}
                    <br/>
                    <span className="font-bold italic">Flying higher is safer but drains fuel rapidly! Stay low to survive.</span>
                </p>
                <button 
                    onClick={handleStart}
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
                    onClick={handleStart}
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
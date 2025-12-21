# Abduction: Chaos at The Farm

A retro-styled arcade game where you pilot a UFO to abduct a cow while navigating through farm obstacles. Built with Phaser 3 and TypeScript.

## Gameplay

- **Objective:** Keep your bovine captive safe while flying through the farms
- **Controls:** Hold `Spacebar` or `Touch` to thrust upward
- **Fuel Management:** Flying higher drains fuel faster - stay low to recharge your GraviFuel
- **Avoid:** Barns and silos will destroy your UFO and your precious cargo

## Development

### Prerequisites

- Node.js (v18+)
- npm

### Setup

```bash
# Install dependencies
make install
# or
npm install
```

### Development Server

```bash
# Start dev server at http://localhost:3000
make dev
# or
npm run dev
```

### Build

```bash
# Build for production (outputs to dist/)
make build
# or
npm run build

# Preview production build locally
make preview
```

### Distribution

```bash
# Create zip file for itch.io distribution
make dist
```

### Clean

```bash
# Remove build artifacts
make clean
```

## Project Structure

```
├── public/
│   └── assets/
│       ├── audio/          # Sound effects (mp3)
│       ├── *.png           # Sprite images
│       └── *.svg           # Vector graphics
├── src/
│   ├── main.ts             # Game entry point and Phaser config
│   └── scenes/
│       ├── BootScene.ts    # Asset loading
│       ├── MenuScene.ts    # Title screen
│       ├── GameScene.ts    # Main gameplay
│       └── GameOverScene.ts # Game over screen
├── utils/
│   ├── gameConstants.ts    # Game tuning parameters
│   └── strings.ts          # UI text (localization-ready)
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
└── Makefile                # Build shortcuts
```

## Tech Stack

- **Game Engine:** [Phaser 3](https://phaser.io/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** TypeScript
- **Fonts:** IM Fell English (Google Fonts)

## Assets

### Images

- `ufo.png` / `ufo_thrust.png` - Player spacecraft
- `cow.svg` - Abductee
- `barn.png` / `silo.png` - Obstacles
- `ground.png` - Scrolling terrain
- `cloud.png` - Background clouds
- `beam.svg` - Tractor beam
- `explosion.png` / `splat.png` - Death effects

### Audio

- `gravidrive.mp3` - Thrust sound (looping)
- `crash.mp3` - UFO collision
- `splat.mp3` - Cow collision
- `moo.mp3` - Ambient cow sounds

## Configuration

Game parameters can be tuned in `utils/gameConstants.ts`:

- `GAME_SPEED` - Scroll speed
- `GRAVITY` - Player fall rate
- `THRUST` - Upward force
- `MAX_FUEL` / `FUEL_CONSUMPTION` / `FUEL_RECHARGE` - Fuel mechanics
- `SPAWN_RATE` - Obstacle frequency

UI text is centralized in `utils/strings.ts` for easy localization.

## License

All rights reserved.

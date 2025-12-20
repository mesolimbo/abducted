export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    // Show loading text
    const { width, height } = this.scale;
    const loadingText = this.add.text(width / 2, height / 2, 'Loading...', {
      fontFamily: 'IM Fell English',
      fontSize: '32px',
      color: '#2c1c11'
    }).setOrigin(0.5);

    // Load all SVG assets
    this.load.svg('ufo', 'assets/ufo.svg');
    this.load.svg('ufo_thrust', 'assets/ufo_thrust.svg');
    this.load.svg('cow', 'assets/cow.svg');
    this.load.svg('barn', 'assets/barn.svg');
    this.load.svg('silo', 'assets/silo.svg');
    this.load.svg('ground', 'assets/ground.svg');
    this.load.svg('beam', 'assets/beam.svg');
    this.load.svg('cloud', 'assets/cloud.svg');
    this.load.svg('explosion', 'assets/explosion.svg');
    this.load.svg('splat', 'assets/splat.svg');

    // Update loading progress
    this.load.on('progress', (value: number) => {
      loadingText.setText('Loading... ' + Math.round(value * 100) + '%');
    });
  }

  create(): void {
    this.scene.start('MenuScene');
  }
}

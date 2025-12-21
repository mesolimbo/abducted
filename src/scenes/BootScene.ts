import { STRINGS } from '../../utils/strings';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    // Show loading text
    const { width, height } = this.scale;
    const loadingText = this.add.text(width / 2, height / 2, STRINGS.LOADING, {
      fontFamily: 'IM Fell English',
      fontSize: '32px',
      color: '#2c1c11'
    }).setOrigin(0.5);

    // Load all SVG assets
    this.load.image('ufo', 'assets/ufo.png');
    this.load.image('ufo_thrust', 'assets/ufo_thrust.png');
    this.load.svg('cow', 'assets/cow.svg');
    this.load.image('barn', 'assets/barn.png');
    this.load.image('silo', 'assets/silo.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.svg('beam', 'assets/beam.svg');
    this.load.image('cloud', 'assets/cloud.png');
    this.load.svg('explosion', 'assets/explosion.svg');
    this.load.svg('splat', 'assets/splat.svg');

    // Update loading progress
    this.load.on('progress', (value: number) => {
      loadingText.setText(STRINGS.LOADING_PROGRESS(Math.round(value * 100)));
    });
  }

  create(): void {
    this.scene.start('MenuScene');
  }
}

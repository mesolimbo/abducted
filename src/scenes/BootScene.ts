import { ASSET_SVGS, getSvgDataUri } from '../Assets';

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
    this.load.image('ufo', getSvgDataUri(ASSET_SVGS.ufo));
    this.load.image('ufo_thrust', getSvgDataUri(ASSET_SVGS.ufo_thrust));
    this.load.image('cow', getSvgDataUri(ASSET_SVGS.cow));
    this.load.image('barn', getSvgDataUri(ASSET_SVGS.barn));
    this.load.image('silo', getSvgDataUri(ASSET_SVGS.silo));
    this.load.image('ground', getSvgDataUri(ASSET_SVGS.ground));
    this.load.image('beam', getSvgDataUri(ASSET_SVGS.beam));
    this.load.image('cloud', getSvgDataUri(ASSET_SVGS.cloud));
    this.load.image('explosion', getSvgDataUri(ASSET_SVGS.explosion));
    this.load.image('splat', getSvgDataUri(ASSET_SVGS.splat));

    // Update loading progress
    this.load.on('progress', (value: number) => {
      loadingText.setText('Loading... ' + Math.round(value * 100) + '%');
    });
  }

  create(): void {
    this.scene.start('MenuScene');
  }
}

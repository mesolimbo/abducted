import { STRINGS } from '../../utils/strings';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create(): void {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    // Semi-transparent background overlay
    this.add.rectangle(centerX, centerY, width, height, 0xf3e6d0, 0.9);

    // Main container box
    const boxWidth = Math.min(480, width - 40);
    const boxHeight = Math.min(540, height - 40);
    const boxTop = centerY - boxHeight / 2;

    // Box background
    this.add.rectangle(centerX, centerY, boxWidth, boxHeight, 0xf3e6d0)
      .setStrokeStyle(4, 0x2c1c11);

    // Inner border
    this.add.rectangle(centerX, centerY, boxWidth - 16, boxHeight - 16)
      .setStrokeStyle(1, 0x2c1c11, 0.5);

    // Title - positioned from top of box
    this.add.text(centerX, boxTop + 50, STRINGS.TITLE, {
      fontFamily: 'IM Fell English SC',
      fontSize: '52px',
      color: '#2c1c11'
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(centerX, boxTop + 105, STRINGS.SUBTITLE, {
      fontFamily: 'IM Fell English',
      fontSize: '22px',
      color: '#2c1c11',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    // Divider line
    const dividerY = boxTop + 135;
    this.add.rectangle(centerX, dividerY, 200, 2, 0x2c1c11);

    // Start button - positioned from bottom of box
    const buttonY = boxTop + boxHeight - 60;

    // Instructions - centered between divider and button
    const instructionText = STRINGS.INSTRUCTIONS.PILOT + ' Spacebar or Touch.\n\n' +
      STRINGS.INSTRUCTIONS.GOAL + '\n\nFlying higher is safer but drains fuel rapidly!\nStay low to survive.';

    const contentAreaTop = dividerY + 10;
    const contentAreaBottom = buttonY - 35;
    const instructionsY = (contentAreaTop + contentAreaBottom) / 2;

    this.add.text(centerX, instructionsY, instructionText, {
      fontFamily: 'IM Fell English',
      fontSize: '17px',
      color: '#2c1c11',
      align: 'center',
      wordWrap: { width: boxWidth - 80 },
      lineSpacing: 8
    }).setOrigin(0.5);
    const button = this.add.rectangle(centerX, buttonY, 220, 50, 0x2c1c11)
      .setInteractive({ useHandCursor: true });

    this.add.text(centerX, buttonY, STRINGS.BTN_START, {
      fontFamily: 'IM Fell English',
      fontSize: '20px',
      color: '#f3e6d0'
    }).setOrigin(0.5);

    // Button hover effect
    button.on('pointerover', () => button.setFillStyle(0x4a3b2a));
    button.on('pointerout', () => button.setFillStyle(0x2c1c11));
    button.on('pointerdown', () => this.startGame());

    // Spacebar to start
    this.input.keyboard?.on('keydown-SPACE', () => this.startGame());

    // Handle resize
    this.scale.on('resize', () => this.scene.restart(), this);
  }

  startGame(): void {
    this.scene.start('GameScene');
  }
}

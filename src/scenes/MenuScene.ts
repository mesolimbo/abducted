import { STRINGS } from '../../utils/strings';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create(): void {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;
    const groundY = height - 80;

    // Background elements (visible behind overlay)
    // Clouds
    for (let i = 0; i < 3; i++) {
      this.add.image(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(50, 200),
        'cloud'
      ).setAlpha(0.3).setScale(Phaser.Math.FloatBetween(0.5, 1)).setDepth(0);
    }

    // Ground
    this.add.tileSprite(width / 2, height - 40, width, 80, 'ground').setDepth(0);

    // Starting barn
    this.add.image(width * 0.6, groundY, 'barn').setOrigin(0.5, 1).setDepth(0);

    // Cow on ground
    this.add.image(width * 0.15, groundY - 13, 'cow-static').setScale(0.6).setDepth(0);

    // Semi-transparent background overlay
    this.add.rectangle(centerX, centerY, width, height, 0xf3e6d0, 0.8).setDepth(1);

    // Main container box
    const boxWidth = Math.min(480, width - 40);
    const boxHeight = Math.min(540, height - 40);
    const boxTop = centerY - boxHeight / 2;

    // Box background
    this.add.rectangle(centerX, centerY, boxWidth, boxHeight, 0xf3e6d0)
      .setStrokeStyle(4, 0x2c1c11).setDepth(2);

    // Inner border
    this.add.rectangle(centerX, centerY, boxWidth - 16, boxHeight - 16)
      .setStrokeStyle(1, 0x2c1c11, 0.5).setDepth(2);

    // Title - positioned from top of box
    this.add.text(centerX, boxTop + 50, STRINGS.TITLE, {
      fontFamily: 'IM Fell English SC',
      fontSize: '52px',
      color: '#2c1c11'
    }).setOrigin(0.5).setDepth(2);

    // Subtitle
    this.add.text(centerX, boxTop + 105, STRINGS.SUBTITLE, {
      fontFamily: 'IM Fell English',
      fontSize: '22px',
      color: '#2c1c11',
      fontStyle: 'italic'
    }).setOrigin(0.5).setDepth(2);

    // Divider line
    const dividerY = boxTop + 135;
    this.add.rectangle(centerX, dividerY, 200, 2, 0x2c1c11).setDepth(2);

    // Start button - positioned from bottom of box
    const buttonY = boxTop + boxHeight - 60;

    // Instructions - centered between divider and button
    const contentAreaTop = dividerY + 10;
    const contentAreaBottom = buttonY - 35;
    const contentCenterY = (contentAreaTop + contentAreaBottom) / 2;

    // Build instruction lines with styling info
    const normalStyle = {
      fontFamily: 'IM Fell English',
      fontSize: '17px',
      color: '#2c1c11',
      align: 'center' as const,
      wordWrap: { width: boxWidth - 60 }
    };

    // Line 1: "Pilot your vessel using"
    const line1 = this.add.text(centerX, 0, STRINGS.INSTRUCTIONS.PILOT, normalStyle)
      .setOrigin(0.5).setDepth(2);

    // Line 2: "Spacebar or Touch" - bold and red
    const line2 = this.add.text(centerX, 0, `${STRINGS.INSTRUCTIONS.KEY_SPACE} ${STRINGS.INSTRUCTIONS.OR} ${STRINGS.INSTRUCTIONS.TOUCH}`, {
      fontFamily: 'IM Fell English',
      fontSize: '19px',
      color: '#991b1b',
      align: 'center',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(2);

    // Line 3: Goal text
    const line3 = this.add.text(centerX, 0, STRINGS.INSTRUCTIONS.GOAL, normalStyle)
      .setOrigin(0.5).setDepth(2);

    // Line 4: Altitude warning
    const line4 = this.add.text(centerX, 0, STRINGS.INSTRUCTIONS.ALTITUDE_WARNING, normalStyle)
      .setOrigin(0.5).setDepth(2);

    // Line 5: "Stay low to survive." - bold
    const line5 = this.add.text(centerX, 0, STRINGS.INSTRUCTIONS.SURVIVAL_TIP, {
      fontFamily: 'IM Fell English',
      fontSize: '19px',
      color: '#2c1c11',
      align: 'center',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(2);

    // Calculate total height and position all lines centered
    const lineSpacing = 8;
    const blockSpacing = 16;
    const totalHeight = line1.height + line2.height + line3.height + line4.height + line5.height +
      (lineSpacing * 2) + (blockSpacing * 2);

    let y = contentCenterY - totalHeight / 2;

    line1.setY(y + line1.height / 2);
    y += line1.height + lineSpacing;

    line2.setY(y + line2.height / 2);
    y += line2.height + blockSpacing;

    line3.setY(y + line3.height / 2);
    y += line3.height + blockSpacing;

    line4.setY(y + line4.height / 2);
    y += line4.height + lineSpacing;

    line5.setY(y + line5.height / 2);

    const button = this.add.rectangle(centerX, buttonY, 220, 50, 0x2c1c11)
      .setInteractive({ useHandCursor: true }).setDepth(2);

    this.add.text(centerX, buttonY, STRINGS.BTN_START, {
      fontFamily: 'IM Fell English',
      fontSize: '20px',
      color: '#f3e6d0'
    }).setOrigin(0.5).setDepth(2);

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

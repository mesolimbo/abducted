import { STRINGS } from '../../utils/strings';

interface GameOverData {
  score: number;
  highScore: number;
  deathReason: 'ufo' | 'cow';
}

export class GameOverScene extends Phaser.Scene {
  private score: number = 0;
  private highScore: number = 0;
  private deathReason: 'ufo' | 'cow' = 'ufo';

  constructor() {
    super('GameOverScene');
  }

  init(data: GameOverData): void {
    this.score = data.score || 0;
    this.highScore = data.highScore || 0;
    this.deathReason = data.deathReason || 'ufo';
  }

  create(): void {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    // Dark overlay background
    this.add.rectangle(centerX, centerY, width, height, 0x2c1c11, 0.9);

    // Main container box
    const boxWidth = Math.min(420, width - 40);
    const boxHeight = Math.min(320, height - 40);

    // Box background
    this.add.rectangle(centerX, centerY, boxWidth, boxHeight, 0xf3e6d0)
      .setStrokeStyle(4, 0x2c1c11);

    // Inner border
    this.add.rectangle(centerX, centerY, boxWidth - 16, boxHeight - 16)
      .setStrokeStyle(1, 0x2c1c11, 0.5);

    // Game Over title
    this.add.text(centerX, centerY - 100, STRINGS.GAME_OVER_TITLE, {
      fontFamily: 'IM Fell English SC',
      fontSize: '48px',
      color: '#2c1c11'
    }).setOrigin(0.5);

    // Death reason
    const reasonText = this.deathReason === 'ufo' ? STRINGS.REASON_UFO : STRINGS.REASON_COW;
    this.add.text(centerX, centerY - 45, reasonText, {
      fontFamily: 'IM Fell English',
      fontSize: '22px',
      color: '#2c1c11',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    // Divider
    this.add.rectangle(centerX, centerY - 20, 150, 1, 0x2c1c11);

    // Score
    this.add.text(centerX, centerY + 15, STRINGS.SCORE_PREFIX + this.score, {
      fontFamily: 'IM Fell English SC',
      fontSize: '32px',
      color: '#2c1c11'
    }).setOrigin(0.5);

    // High score (if achieved)
    if (this.score >= this.highScore && this.score > 0) {
      this.add.text(centerX, centerY + 55, 'New High Score!', {
        fontFamily: 'IM Fell English',
        fontSize: '18px',
        color: '#991b1b',
        fontStyle: 'italic'
      }).setOrigin(0.5);
    }

    // Retry button
    const buttonY = centerY + 110;
    const button = this.add.rectangle(centerX, buttonY, 200, 50, 0x2c1c11)
      .setInteractive({ useHandCursor: true });

    this.add.text(centerX, buttonY, STRINGS.BTN_RETRY, {
      fontFamily: 'IM Fell English',
      fontSize: '20px',
      color: '#f3e6d0'
    }).setOrigin(0.5);

    // Button hover effect
    button.on('pointerover', () => button.setFillStyle(0x4a3b2a));
    button.on('pointerout', () => button.setFillStyle(0x2c1c11));
    button.on('pointerdown', () => this.restartGame());

    // Spacebar to restart
    this.input.keyboard?.on('keydown-SPACE', () => this.restartGame());

    // Handle resize
    this.scale.on('resize', () => this.scene.restart({
      score: this.score,
      highScore: this.highScore,
      deathReason: this.deathReason
    }), this);
  }

  restartGame(): void {
    this.scene.start('GameScene');
  }
}

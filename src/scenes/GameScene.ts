import {
  GAME_SPEED,
  GRAVITY,
  THRUST,
  MAX_FUEL,
  FUEL_CONSUMPTION,
  FUEL_RECHARGE,
  SPAWN_RATE,
} from '../../utils/gameConstants';
import { STRINGS } from '../../utils/strings';

export class GameScene extends Phaser.Scene {
  // Game objects
  player!: Phaser.Physics.Arcade.Sprite;
  cow!: Phaser.Physics.Arcade.Sprite;
  beam!: Phaser.GameObjects.Image;
  ground!: Phaser.GameObjects.TileSprite;
  obstacles!: Phaser.Physics.Arcade.Group;
  clouds!: Phaser.GameObjects.Group;

  // HUD elements
  scoreText!: Phaser.GameObjects.Text;
  highScoreText!: Phaser.GameObjects.Text;
  fuelBarBg!: Phaser.GameObjects.Rectangle;
  fuelBarFill!: Phaser.GameObjects.Rectangle;
  fuelLabel!: Phaser.GameObjects.Text;
  fuelWarning!: Phaser.GameObjects.Text;

  // Game state
  currentFuel: number = MAX_FUEL;
  currentScore: number = 0;
  highScore: number = 0;
  spawnTimer: number = 0;
  isDying: boolean = false;
  introPhase: number = 0;
  isPlaying: boolean = false;

  // Input
  spaceKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super('GameScene');
  }

  init(): void {
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('abduction-highscore');
    if (savedHighScore) {
      this.highScore = parseInt(savedHighScore, 10);
    }

    // Reset game state
    this.currentFuel = MAX_FUEL;
    this.currentScore = 0;
    this.spawnTimer = 0;
    this.isDying = false;
    this.introPhase = 0;
    this.isPlaying = false;
  }

  create(): void {
    const { width, height } = this.scale;

    // Create clouds (background)
    this.clouds = this.add.group();
    for (let i = 0; i < 3; i++) {
      this.clouds.create(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(50, 200),
        'cloud'
      )
        .setAlpha(0.3)
        .setScale(Phaser.Math.FloatBetween(0.5, 1));
    }

    // Ground
    this.ground = this.add.tileSprite(width / 2, height - 40, width, 80, 'ground');
    this.physics.add.existing(this.ground, true);

    // Obstacles group
    this.obstacles = this.physics.add.group();

    // Starting barn
    const groundY = height - 80;
    const startingBarn = this.obstacles.create(width * 0.6, groundY, 'barn');
    startingBarn.setOrigin(0.5, 1);
    startingBarn.body.setAllowGravity(false);

    // Tractor beam
    this.beam = this.add.image(0, 0, 'beam').setOrigin(0.5, 0).setVisible(false);

    // Player (UFO) - start off-screen
    this.player = this.physics.add.sprite(-300, -300, 'ufo');
    this.player.setScale(0.22);
    this.player.setCollideWorldBounds(true);
    this.player.body!.setAllowGravity(false);
    (this.player.body as Phaser.Physics.Arcade.Body).setSize(
      this.player.width * 0.7,
      this.player.height * 0.4
    );

    // Cow - starts on the ground, will be abducted during intro
    this.cow = this.physics.add.sprite(width * 0.15, groundY - 9, 'cow');
    this.cow.setScale(0.6);
    this.cow.body!.setAllowGravity(false);
    (this.cow.body as Phaser.Physics.Arcade.Body).setSize(
      this.cow.width * 0.8,
      this.cow.height * 0.8
    );

    // Collision handlers
    this.physics.add.overlap(this.cow, this.obstacles, () => this.onFatalCollision('cow'));
    this.physics.add.overlap(this.player, this.obstacles, () => this.onFatalCollision('ufo'));
    this.physics.add.collider(this.player, this.ground, () => this.onFatalCollision('ufo'));
    this.physics.add.overlap(this.player, this.cow, () => {
      const dist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        this.cow.x, this.cow.y
      );
      if (dist < 40 && this.isPlaying && !this.isDying) {
        this.onFatalCollision('ufo');
      }
    });

    // Input
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Create HUD
    this.createHUD();

    // Handle resize
    this.scale.on('resize', this.onResize, this);

    // Start intro sequence
    this.introPhase = 0;
  }

  createHUD(): void {
    const { width } = this.scale;

    // Score (top left)
    this.scoreText = this.add.text(24, 24, STRINGS.SCORE_PREFIX + '0', {
      fontFamily: 'IM Fell English SC',
      fontSize: '28px',
      color: '#2c1c11'
    }).setScrollFactor(0).setDepth(100);

    this.highScoreText = this.add.text(24, 56, STRINGS.HIGH_SCORE_PREFIX + this.highScore, {
      fontFamily: 'IM Fell English',
      fontSize: '14px',
      color: '#2c1c11',
      fontStyle: 'italic'
    }).setScrollFactor(0).setDepth(100).setAlpha(0.75);

    // Fuel bar (top right)
    const fuelBarWidth = 180;
    const fuelBarX = width - fuelBarWidth - 24;

    this.fuelLabel = this.add.text(fuelBarX + fuelBarWidth / 2, 24, STRINGS.FUEL_LABEL, {
      fontFamily: 'IM Fell English SC',
      fontSize: '14px',
      color: '#2c1c11'
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);

    this.fuelBarBg = this.add.rectangle(fuelBarX, 44, fuelBarWidth, 16, 0xffffff)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0x2c1c11)
      .setScrollFactor(0)
      .setDepth(100);

    this.fuelBarFill = this.add.rectangle(fuelBarX + 2, 46, fuelBarWidth - 4, 12, 0x2c1c11)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(100);

    this.fuelWarning = this.add.text(fuelBarX + fuelBarWidth / 2, 66, STRINGS.FUEL_WARNING, {
      fontFamily: 'IM Fell English',
      fontSize: '12px',
      color: '#991b1b'
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100).setVisible(false);
  }

  onFatalCollision(source: 'ufo' | 'cow'): void {
    if (!this.isPlaying || this.isDying) return;

    this.isDying = true;
    this.beam.setVisible(false);

    if (source === 'ufo') {
      this.add.image(this.player.x, this.player.y, 'explosion').setScale(1.2);
      this.player.setVisible(false);
    } else {
      this.add.image(this.cow.x, this.cow.y, 'splat').setScale(1.0);
      this.cow.setVisible(false);
    }

    // Stop movement
    this.obstacles.getChildren().forEach((obs: any) => {
      if (obs.body) obs.body.velocity.x = 0;
    });
    (this.player.body as Phaser.Physics.Arcade.Body).setGravityY(0);
    this.player.body!.setVelocity(0, 0);

    // Update high score
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      localStorage.setItem('abduction-highscore', this.highScore.toString());
    }

    // Delay before game over screen
    this.time.delayedCall(700, () => {
      this.scene.start('GameOverScene', {
        score: this.currentScore,
        highScore: this.highScore,
        deathReason: source
      });
    });
  }

  onResize(gameSize: Phaser.Structs.Size): void {
    const width = gameSize.width;
    const height = gameSize.height;

    // Reposition Ground
    this.ground.width = width;
    this.ground.x = width / 2;
    this.ground.y = height - 40;
    if (this.ground.body) {
      (this.ground.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();
    }

    // Reposition obstacles
    const groundY = height - 80;
    this.obstacles.children.iterate((obs: any) => {
      if (obs) {
        obs.y = groundY;
        if (obs.body) {
          obs.body.y = groundY - obs.displayHeight;
        }
      }
      return true;
    });

    // Reposition HUD
    const fuelBarWidth = 180;
    const fuelBarX = width - fuelBarWidth - 24;
    this.fuelLabel.setX(fuelBarX + fuelBarWidth / 2);
    this.fuelBarBg.setX(fuelBarX);
    this.fuelBarFill.setX(fuelBarX + 2);
    this.fuelWarning.setX(fuelBarX + fuelBarWidth / 2);
  }

  update(time: number, delta: number): void {
    const { height, width } = this.scale;

    // Handle intro sequence
    if (!this.isPlaying && !this.isDying) {
      this.handleIntro(delta, width, height);
      return;
    }

    if (!this.isPlaying || this.isDying) return;

    const isThrusting = this.spaceKey.isDown || this.input.activePointer.isDown;
    const groundY = height - 80;

    // Handle thrust and fuel
    if (isThrusting) {
      if (this.currentFuel > 0) {
        (this.player.body as Phaser.Physics.Arcade.Body).velocity.y += THRUST * 50;

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

    // Update cow position (follows UFO)
    const targetCowY = this.player.y + 200;
    this.cow.x = this.player.x;
    this.cow.y = Math.min(groundY - 9, targetCowY);

    // Update beam
    this.beam.x = this.player.x;
    this.beam.y = this.player.y + 5;
    this.beam.displayHeight = Math.max(0, (this.cow.y + 9) - this.beam.y);
    this.beam.setVisible(true);

    // Scroll ground and clouds
    this.ground.tilePositionX += GAME_SPEED;
    this.clouds.children.iterate((c: any) => {
      c.x -= GAME_SPEED * 0.2;
      if (c.x < -100) c.x = width + 100;
      return true;
    });

    // Spawn obstacles
    this.spawnTimer += delta;
    if (this.spawnTimer > SPAWN_RATE * 16.6) {
      this.spawnTimer = 0;
      const type = Math.random() > 0.5 ? 'barn' : 'silo';
      const obs = this.obstacles.create(width + 150, groundY, type);
      obs.setOrigin(0.5, 1);
      obs.body.setAllowGravity(false);
      obs.body.velocity.x = -GAME_SPEED * 60;
      obs.passed = false;
    }

    // Update obstacles and score
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
      return true;
    });

    // Update HUD
    this.updateHUD();
  }

  updateHUD(): void {
    this.scoreText.setText(STRINGS.SCORE_PREFIX + this.currentScore);
    this.highScoreText.setText(STRINGS.HIGH_SCORE_PREFIX + Math.max(this.highScore, this.currentScore));

    // Update fuel bar
    const fuelPercent = this.currentFuel / MAX_FUEL;
    const maxWidth = 176;
    this.fuelBarFill.width = maxWidth * fuelPercent;

    // Change color when low
    if (this.currentFuel < 30) {
      this.fuelBarFill.setFillStyle(0x991b1b);
      this.fuelWarning.setVisible(true);
    } else {
      this.fuelBarFill.setFillStyle(0x2c1c11);
      this.fuelWarning.setVisible(false);
    }
  }

  handleIntro(delta: number, width: number, height: number): void {
    const targetX = width * 0.15;
    const targetY = height * 0.25;
    const groundY = height - 80;

    if (this.introPhase === 0) {
      // Move UFO to starting position
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
      // Abduct the cow
      this.beam.x = this.player.x;
      this.beam.y = this.player.y + 5;

      const targetCowY = this.player.y + 200;
      if (this.cow.y > targetCowY) {
        this.cow.y -= 2.5;
        this.beam.displayHeight = (this.cow.y + 9) - this.beam.y;
      } else {
        this.cow.y = targetCowY;
        this.introPhase = 2;
      }
    } else if (this.introPhase === 2) {
      // Start gameplay
      (this.player.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
      (this.player.body as Phaser.Physics.Arcade.Body).setGravityY(GRAVITY * 1000);
      this.isPlaying = true;
      this.introPhase = 0;
    }
  }
}

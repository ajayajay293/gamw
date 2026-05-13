// ===========================
// Shadow Veil: Awakening - Game Engine
// ===========================
import type {
  PlayerState, EnemyState, CollectibleState, Particle,
  CheckpointState, PlatformState, HazardState, PortalState,
  CameraState, DamageNumber, FloatingText, Projectile,
  LevelData, ComboSystem, EnemyType,
} from '@/types/game';

// ============ CONSTANTS ============
const GRAVITY = 1800;
const MAX_FALL_SPEED = 900;
const MOVE_SPEED = 280;
const RUN_SPEED = 420;
const JUMP_FORCE = -620;
const WALL_JUMP_FORCE_X = 350;
const WALL_JUMP_FORCE_Y = -550;
const DASH_SPEED = 600;
const DASH_DURATION = 0.15;
const DASH_COOLDOWN = 0.6;
const ATTACK_COOLDOWN = 0.3;
const COYOTE_TIME = 0.08;
const JUMP_BUFFER = 0.1;
const INVINCIBLE_TIME = 0.8;
const ICE_FRICTION = 0.995;
const NORMAL_FRICTION = 0.82;
const AIR_FRICTION = 0.96;
const ACCEL = 2400;
// const DECEL = 3000;
const BOUNCE_FORCE = -800;

const TILE_COLORS: Record<number, string> = {
  0: 'transparent',     // empty
  1: '#3a3a4e',         // solid
  2: '#4a4a5e',         // platform
  3: '#e63946',         // spike
  4: '#ff4800',         // lava
  5: '#8b6914',         // breakable
  6: '#a8d8ea',         // ice
  7: '#9b59b6',         // bounce
  8: '#4cc9f0',         // checkpoint
  9: '#4cc9f0',         // portal
  10: '#2d5a27',        // climbable
  11: 'transparent',     // moving path
  12: '#1e3a5f',        // water
  13: '#4a4a5e80',      // secret wall
};

const ENEMY_HP: Record<EnemyType, number> = {
  wraith: 30, shield_knight: 60, bat: 20,
  boss_gatekeeper: 500, shooter: 25, charger: 40, jumper: 35,
};

// ============ ASSET LOADING ============
const imageCache: Record<string, HTMLImageElement> = {};
function loadImage(src: string): HTMLImageElement {
  if (imageCache[src]) return imageCache[src];
  const img = new Image();
  img.src = src;
  imageCache[src] = img;
  return img;
}

// ============ ENGINE CLASS ============
export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  level!: LevelData;
  player!: PlayerState;
  enemies: EnemyState[] = [];
  collectibles: CollectibleState[] = [];
  particles: Particle[] = [];
  checkpoints: CheckpointState[] = [];
  platforms: PlatformState[] = [];
  hazards: HazardState[] = [];
  portals: PortalState[] = [];
  projectiles: Projectile[] = [];
  damageNumbers: DamageNumber[] = [];
  floatingTexts: FloatingText[] = [];
  camera: CameraState = { x: 0, y: 0, targetX: 0, targetY: 0, shakeX: 0, shakeY: 0, shakeIntensity: 0, shakeDecay: 0, zoom: 1 };
  combo: ComboSystem = { count: 0, timer: 0, maxCombo: 0, multiplier: 1 };

  // Input
  keys: Record<string, boolean> = {};
  touchState = { joystickX: 0, joystickY: 0, jumpPressed: false, attackPressed: false, dashPressed: false };

  // Timing
  lastTime = 0;
  accumulator = 0;
  FIXED_DT = 1 / 60;
  gameTime = 0;
  running = false;
  animationFrameId = 0;

  // Callbacks
  onVictory?: (score: number, stars: number, time: number) => void;
  onGameOver?: () => void;
  onScoreUpdate?: (score: number, coins: number, combo: number) => void;
  onHpUpdate?: (hp: number, maxHp: number) => void;

  // Level data
  tileWidth = 0;
  tileHeight = 0;
  bgImage: HTMLImageElement | null = null;

  // Difficulty
  playerAttackDamage = 15;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
  }

  // ============ SETUP ============
  initLevel(levelData: LevelData, upgrades?: { hpLevel: number; attackLevel: number; speedLevel: number }) {
    this.level = levelData;
    this.tileWidth = levelData.width / levelData.tileSize;
    this.tileHeight = levelData.height / levelData.tileSize;
    this.gameTime = 0;
    this.enemies = [];
    this.collectibles = [];
    this.particles = [];
    this.checkpoints = [];
    this.platforms = [];
    this.hazards = [];
    this.portals = [];
    this.projectiles = [];
    this.damageNumbers = [];
    this.floatingTexts = [];
    this.combo = { count: 0, timer: 0, maxCombo: 0, multiplier: 1 };
    this.camera = { x: 0, y: 0, targetX: 0, targetY: 0, shakeX: 0, shakeY: 0, shakeIntensity: 0, shakeDecay: 8, zoom: 1 };

    // Apply upgrades
    const hpMult = 1 + (upgrades?.hpLevel ?? 1) * 0.15;
    const atkMult = 1 + (upgrades?.attackLevel ?? 1) * 0.15;
    void (1 + (upgrades?.speedLevel ?? 1) * 0.1); // speed multiplier reserved
    this.playerAttackDamage = Math.floor(15 * atkMult);

    // Spawn player
    const [px, py] = levelData.playerSpawn;
    this.player = {
      x: px, y: py, vx: 0, vy: 0, width: 36, height: 52,
      hp: Math.floor(100 * hpMult), maxHp: Math.floor(100 * hpMult),
      energy: 100, maxEnergy: 100, coins: 0, gems: 0, xp: 0, level: 1, lives: 5,
      facing: 1, isGrounded: false, isJumping: false, isAttacking: false,
      isDashing: false, isHurt: false, isDead: false, isWallSliding: false,
      isClimbing: false, isSwimming: false, isGliding: false, isSliding: false,
      comboCount: 0, invincibleTimer: 0, attackCooldown: 0, dashCooldown: 0,
      dashTimer: 0, wallSlideTimer: 0, coyoteTimer: 0, jumpBufferTimer: 0,
      animFrame: 0, animTimer: 0, state: 'idle', skin: 'default', hasKey: false,
    };

    // Spawn enemies
    for (const es of levelData.enemies) {
      const hp = ENEMY_HP[es.type] * (es.phase === 2 ? 1.5 : 1);
      this.enemies.push({
        id: `enemy_${Math.random().toString(36).slice(2)}`,
        x: es.x, y: es.y, vx: 0, vy: 0,
        width: es.type === 'boss_gatekeeper' ? 80 : es.type === 'shield_knight' ? 48 : 40,
        height: es.type === 'boss_gatekeeper' ? 100 : es.type === 'shield_knight' ? 64 : 44,
        hp, maxHp: hp, type: es.type, facing: -1, isGrounded: false,
        isHurt: false, isAttacking: false, isDead: false, isStunned: false,
        isShielded: es.type === 'shield_knight', animFrame: 0, animTimer: 0,
        state: 'idle', patrolStart: es.x - (es.patrolDist ?? 100),
        patrolEnd: es.x + (es.patrolDist ?? 100), attackCooldown: 0,
        stunTimer: 0, hurtTimer: 0, phase: es.phase ?? 1, rageMode: false,
        detectRange: es.type === 'boss_gatekeeper' ? 600 : es.type === 'shooter' ? 500 : 250,
        attackRange: es.type === 'boss_gatekeeper' ? 120 : es.type === 'charger' ? 80 : 60,
        moveSpeed: es.type === 'charger' ? 200 : es.type === 'bat' ? 100 : 60,
        damage: es.type === 'boss_gatekeeper' ? 20 : es.type === 'charger' ? 15 : 10,
        scoreValue: es.type === 'boss_gatekeeper' ? 1000 : es.type === 'shield_knight' ? 250 : 100,
        dropTable: [
          { type: 'coin', chance: 0.7, minCount: 1, maxCount: 3 },
          { type: 'health', chance: 0.15, minCount: 1, maxCount: 1 },
        ],
      });
    }

    // Spawn collectibles
    for (const cs of levelData.collectibles) {
      this.collectibles.push({
        id: `col_${Math.random().toString(36).slice(2)}`,
        x: cs.x, y: cs.y, type: cs.type, value: cs.value ?? (cs.type === 'gem' ? 50 : cs.type === 'coin' ? 10 : cs.type === 'chest' ? 200 : 25),
        collected: false, bobOffset: Math.random() * Math.PI * 2,
        magnetized: false, animFrame: 0, width: 24, height: 24,
      });
    }

    // Checkpoints
    for (const [cx, cy] of levelData.checkpoints) {
      this.checkpoints.push({ x: cx, y: cy, activated: false, width: 32, height: 80 });
    }

    // Platforms
    for (const pd of levelData.platforms) {
      this.platforms.push({
        x: pd.x, y: pd.y, width: pd.width, height: pd.height,
        type: pd.type, moveAxis: pd.moveAxis ?? 'x', moveSpeed: pd.moveSpeed ?? 0,
        moveRange: pd.moveRange ?? 0, moveOrigin: pd.moveAxis === 'y' ? pd.y : pd.x,
        isBroken: false, currentPos: 0,
      });
    }

    // Hazards
    for (const h of levelData.hazards) {
      this.hazards.push({
        x: h.x, y: h.y, width: h.width, height: h.height,
        type: h.type, damage: h.isInstantKill ? 999 : 20, isInstantKill: h.isInstantKill ?? false,
      });
    }

    // Portals
    for (const p of levelData.portals) {
      this.portals.push({ x: p.x, y: p.y, width: 48, height: 64, targetLevel: levelData.id + 1, isExit: p.isExit, isActive: p.isActive ?? true });
    }

    // Background
    this.bgImage = loadImage(levelData.bgImage);

    this.lastTime = performance.now();
    this.accumulator = 0;
  }

  // ============ INPUT ============
  handleKeyDown(e: KeyboardEvent) {
    this.keys[e.code] = true;
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
  }
  handleKeyUp(e: KeyboardEvent) {
    this.keys[e.code] = false;
  }

  getInputX(): number {
    let x = 0;
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) x -= 1;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) x += 1;
    if (Math.abs(this.touchState.joystickX) > 0.2) x = this.touchState.joystickX;
    return x;
  }

  isJumpPressed(): boolean {
    return this.keys['Space'] || this.keys['KeyW'] || this.keys['ArrowUp'] || this.touchState.jumpPressed;
  }
  isAttackPressed(): boolean {
    return this.keys['KeyX'] || this.keys['KeyJ'] || this.touchState.attackPressed;
  }
  isDashPressed(): boolean {
    return this.keys['KeyC'] || this.keys['KeyK'] || this.keys['ShiftLeft'] || this.touchState.dashPressed;
  }

  // ============ TILE HELPERS ============
  getTileAt(x: number, y: number): number {
    const tx = Math.floor(x / this.level.tileSize);
    const ty = Math.floor(y / this.level.tileSize);
    if (tx < 0 || tx >= this.tileWidth || ty < 0 || ty >= this.tileHeight) return 0;
    return this.level.tiles[ty]?.[tx] ?? 0;
  }

  isSolidTile(tile: number): boolean {
    return tile === 1 || tile === 2 || tile === 5 || tile === 6 || tile === 8 || tile === 10 || tile === 13;
  }

  isHazardTile(tile: number): boolean {
    return tile === 3 || tile === 4;
  }

  // ============ PHYSICS ============
  updatePlayer(dt: number) {
    const p = this.player;
    if (p.isDead) return;

    // Timers
    p.invincibleTimer = Math.max(0, p.invincibleTimer - dt);
    p.attackCooldown = Math.max(0, p.attackCooldown - dt);
    p.dashCooldown = Math.max(0, p.dashCooldown - dt);
    if (p.dashTimer > 0) {
      p.dashTimer -= dt;
      if (p.dashTimer <= 0) { p.isDashing = false; p.vx *= 0.5; }
    }
    p.coyoteTimer = Math.max(0, p.coyoteTimer - dt);
    p.jumpBufferTimer = Math.max(0, p.jumpBufferTimer - dt);

    // Input
    const inputX = this.getInputX();
    const wantJump = this.isJumpPressed();
    const wantAttack = this.isAttackPressed();
    const wantDash = this.isDashPressed();

    // Jump buffer
    if (wantJump) p.jumpBufferTimer = JUMP_BUFFER;

    // Friction
    const onIce = this.getTileAt(p.x + p.width / 2, p.y + p.height + 2) === 6;
    const friction = p.isGrounded ? (onIce ? ICE_FRICTION : NORMAL_FRICTION) : AIR_FRICTION;

    // Movement
    if (!p.isAttacking && !p.isHurt && !p.isDashing) {
      if (inputX !== 0) {
        p.facing = inputX > 0 ? 1 : -1;
        const speed = this.keys['ShiftLeft'] || Math.abs(inputX) > 0.8 ? RUN_SPEED : MOVE_SPEED;
        p.vx += inputX * ACCEL * dt;
        p.vx = Math.max(-speed, Math.min(speed, p.vx));
      } else {
        p.vx *= friction;
        if (Math.abs(p.vx) < 1) p.vx = 0;
      }
    }

    // Gravity
    if (!p.isGrounded && !p.isDashing) {
      p.vy += GRAVITY * dt;
      if (p.vy > MAX_FALL_SPEED) p.vy = MAX_FALL_SPEED;
    }

    // Wall slide detection
    const onWallRight = this.isSolidTile(this.getTileAt(p.x + p.width + 2, p.y + p.height / 2));
    const onWallLeft = this.isSolidTile(this.getTileAt(p.x - 2, p.y + p.height / 2));
    const touchingWall = (onWallRight && inputX > 0) || (onWallLeft && inputX < 0);
    p.isWallSliding = !p.isGrounded && touchingWall && p.vy > 0;

    if (p.isWallSliding) {
      p.vy = Math.min(p.vy, 120);
      p.wallSlideTimer += dt;
      p.facing = onWallRight ? -1 : 1;
    } else {
      p.wallSlideTimer = 0;
    }

    // Wall jump
    if (p.jumpBufferTimer > 0 && p.isWallSliding) {
      p.vy = WALL_JUMP_FORCE_Y;
      p.vx = (onWallRight ? -1 : 1) * WALL_JUMP_FORCE_X;
      p.jumpBufferTimer = 0;
      p.coyoteTimer = 0;
      p.isWallSliding = false;
      this.spawnParticles(p.x + p.width / 2, p.y + p.height, 5, 'dust');
    }

    // Jump
    if (p.jumpBufferTimer > 0 && (p.isGrounded || p.coyoteTimer > 0)) {
      p.vy = JUMP_FORCE;
      p.isGrounded = false;
      p.coyoteTimer = 0;
      p.jumpBufferTimer = 0;
      this.spawnParticles(p.x + p.width / 2, p.y + p.height, 5, 'dust');
    }

    // Variable jump
    if (!wantJump && p.vy < -150 && !p.isWallSliding) {
      p.vy *= 0.7;
    }

    // Dash
    if (wantDash && p.dashCooldown <= 0 && !p.isDashing && p.energy >= 15) {
      p.isDashing = true;
      p.dashTimer = DASH_DURATION;
      p.dashCooldown = DASH_COOLDOWN;
      p.energy -= 15;
      p.vx = p.facing * DASH_SPEED;
      p.vy = 0;
      p.invincibleTimer = DASH_DURATION;
      this.spawnParticles(p.x + p.width / 2, p.y + p.height / 2, 8, 'magic');
    }

    // Attack
    if (wantAttack && p.attackCooldown <= 0 && !p.isAttacking) {
      p.isAttacking = true;
      p.attackCooldown = ATTACK_COOLDOWN;
      p.vx *= 0.3;
      // Check enemy hits
      const attackBox = {
        x: p.facing > 0 ? p.x + p.width : p.x - 50,
        y: p.y + 5, width: 50, height: 40,
      };
      let hitEnemy = false;
      for (const e of this.enemies) {
        if (e.isDead) continue;
        if (this.aabb(attackBox, { x: e.x, y: e.y, width: e.width, height: e.height })) {
          hitEnemy = true;
          this.damageEnemy(e, this.playerAttackDamage, p.facing);
        }
      }
      // Check breakable
      for (const plat of this.platforms) {
        if (plat.type === 'breakable' && !plat.isBroken) {
          if (this.aabb(attackBox, plat)) {
            plat.isBroken = true;
            this.spawnParticles(plat.x + plat.width / 2, plat.y, 10, 'dust');
          }
        }
      }
      // Check crates/hittables in tile layer
      for (let tx = Math.floor(attackBox.x / 48); tx <= Math.floor((attackBox.x + attackBox.width) / 48); tx++) {
        for (let ty = Math.floor(attackBox.y / 48); ty <= Math.floor((attackBox.y + attackBox.height) / 48); ty++) {
          if (ty >= 0 && ty < this.tileHeight && tx >= 0 && tx < this.tileWidth) {
            if (this.level.tiles[ty][tx] === 5) {
              this.level.tiles[ty][tx] = 0;
              this.spawnParticles(tx * 48 + 24, ty * 48 + 24, 10, 'dust');
              if (Math.random() < 0.2) {
                this.collectibles.push({ id: `drop_${Math.random()}`, x: tx * 48, y: ty * 48, type: 'coin', value: 10, collected: false, bobOffset: 0, magnetized: false, animFrame: 0, width: 24, height: 24 });
              }
            }
          }
        }
      }
      if (hitEnemy) {
        this.screenShake(3, 0.1);
      }
      // Reset attack after short delay
      setTimeout(() => { p.isAttacking = false; }, 200);
    }

    // Position update
    p.x += p.vx * dt;
    this.resolveCollisionX(p);
    p.y += p.vy * dt;
    this.resolveCollisionY(p);

    // Ground detection
    const wasGrounded = p.isGrounded;
    p.isGrounded = this.isSolidTile(this.getTileAt(p.x + 4, p.y + p.height + 2)) ||
                   this.isSolidTile(this.getTileAt(p.x + p.width / 2, p.y + p.height + 2)) ||
                   this.isSolidTile(this.getTileAt(p.x + p.width - 4, p.y + p.height + 2));

    // Landing particles
    if (!wasGrounded && p.isGrounded && p.vy > 200) {
      this.spawnParticles(p.x + p.width / 2, p.y + p.height, Math.min(8, Math.floor(p.vy / 100)), 'dust');
    }

    // Coyote time
    if (wasGrounded && !p.isGrounded) p.coyoteTimer = COYOTE_TIME;

    // Bounce pads
    if (this.getTileAt(p.x + p.width / 2, p.y + p.height + 2) === 7 && p.vy >= 0) {
      p.vy = BOUNCE_FORCE;
      p.isGrounded = false;
      this.spawnParticles(p.x + p.width / 2, p.y + p.height, 8, 'magic');
    }

    // Secret walls (passable with dash)
    if (p.isDashing) {
      for (let ty = Math.floor(p.y / 48); ty <= Math.floor((p.y + p.height) / 48); ty++) {
        for (let tx = Math.floor(p.x / 48); tx <= Math.floor((p.x + p.width) / 48); tx++) {
          if (ty >= 0 && ty < this.tileHeight && tx >= 0 && tx < this.tileWidth && this.level.tiles[ty][tx] === 13) {
            this.level.tiles[ty][tx] = 0;
            this.spawnParticles(tx * 48 + 24, ty * 48 + 24, 8, 'dust');
            this.floatingTexts.push({ x: tx * 48, y: ty * 48, text: 'Secret!', color: '#D4A843', life: 1.5, vy: -40, fontSize: 14 });
          }
        }
      }
    }

    // Hazard tiles
    const footTile = this.getTileAt(p.x + p.width / 2, p.y + p.height / 2);
    if (this.isHazardTile(footTile) && p.invincibleTimer <= 0) {
      const dmg = footTile === 3 ? 25 : 999;
      this.damagePlayer(dmg);
    }

    // Hazard rects
    for (const h of this.hazards) {
      if (this.aabb(p, h) && p.invincibleTimer <= 0) {
        if (h.isInstantKill) { p.hp = 0; p.isDead = true; }
        else this.damagePlayer(h.damage);
      }
    }

    // Death check
    if (p.hp <= 0 && !p.isDead) {
      p.isDead = true;
      p.hp = 0;
      this.spawnParticles(p.x + p.width / 2, p.y + p.height / 2, 20, 'blood');
      setTimeout(() => this.onGameOver?.(), 1500);
    }

    // Fall off world
    if (p.y > this.level.height + 100) {
      p.hp = 0;
      p.isDead = true;
      this.onGameOver?.();
    }

    // Energy regen
    if (!p.isDashing) p.energy = Math.min(p.maxEnergy, p.energy + 8 * dt);

    // Climbable (vines)
    p.isClimbing = false;
    const centerTile = this.getTileAt(p.x + p.width / 2, p.y + p.height / 2);
    if (centerTile === 10 && wantJump) {
      p.vy = -200;
      p.isClimbing = true;
    }

    // State
    this.updatePlayerAnim(p, dt);

    // Camera target
    this.camera.targetX = p.x + p.width / 2 - this.canvas.width / 2;
    this.camera.targetY = p.y + p.height / 2 - this.canvas.height / 2;
  }

  updatePlayerAnim(p: PlayerState, _dt: number) {
    if (p.isDead) { p.state = 'death'; return; }
    if (p.isHurt) { p.state = 'hurt'; return; }
    if (p.isDashing) { p.state = 'dash'; return; }
    if (p.isAttacking) { p.state = 'attack1'; return; }
    if (p.isWallSliding) { p.state = 'wallslide'; return; }
    if (p.isClimbing) { p.state = 'climb'; return; }
    if (!p.isGrounded) { p.state = p.vy < 0 ? 'jump' : 'fall'; return; }
    if (Math.abs(p.vx) > 10) { p.state = Math.abs(p.vx) > RUN_SPEED * 0.8 ? 'run' : 'walk'; return; }
    p.state = 'idle';
  }

  // ============ COLLISION ============
  aabb(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }): boolean {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  resolveCollisionX(entity: { x: number; y: number; width: number; height: number; vx: number }) {
    const startX = Math.floor(entity.x / 48);
    const endX = Math.floor((entity.x + entity.width) / 48);
    const startY = Math.floor(entity.y / 48);
    const endY = Math.floor((entity.y + entity.height - 1) / 48);
    for (let ty = startY; ty <= endY; ty++) {
      for (let tx = startX; tx <= endX; tx++) {
        if (ty < 0 || ty >= this.tileHeight || tx < 0 || tx >= this.tileWidth) continue;
        const tile = this.level.tiles[ty][tx];
        if (!this.isSolidTile(tile)) continue;
        if (tile === 13) continue; // secret wall
        const tileX = tx * 48;
        const tileY = ty * 48;
        if (entity.x + entity.width > tileX && entity.x < tileX + 48 &&
            entity.y + entity.height > tileY + 2 && entity.y < tileY + 48 - 2) {
          if (entity.vx > 0) entity.x = tileX - entity.width - 0.1;
          else if (entity.vx < 0) entity.x = tileX + 48 + 0.1;
          entity.vx = 0;
        }
      }
    }
    // Moving platforms
    for (const plat of this.platforms) {
      if (plat.isBroken) continue;
      if (this.aabb(entity, plat)) {
        if (entity.vx > 0) entity.x = plat.x - entity.width - 0.1;
        else if (entity.vx < 0) entity.x = plat.x + plat.width + 0.1;
        entity.vx = 0;
      }
    }
  }

  resolveCollisionY(entity: { x: number; y: number; width: number; height: number; vy: number; isGrounded?: boolean }) {
    const startX = Math.floor(entity.x / 48);
    const endX = Math.floor((entity.x + entity.width - 1) / 48);
    const startY = Math.floor(entity.y / 48);
    const endY = Math.floor((entity.y + entity.height) / 48);
    for (let ty = startY; ty <= endY; ty++) {
      for (let tx = startX; tx <= endX; tx++) {
        if (ty < 0 || ty >= this.tileHeight || tx < 0 || tx >= this.tileWidth) continue;
        const tile = this.level.tiles[ty][tx];
        if (!this.isSolidTile(tile)) continue;
        if (tile === 13) continue;
        const tileX = tx * 48;
        const tileY = ty * 48;
        if (entity.x + entity.width > tileX + 2 && entity.x < tileX + 48 - 2 &&
            entity.y + entity.height > tileY && entity.y < tileY + 48) {
          if (entity.vy > 0) {
            entity.y = tileY - entity.height - 0.1;
            entity.vy = 0;
            entity.isGrounded = true;
          } else if (entity.vy < 0) {
            entity.y = tileY + 48 + 0.1;
            entity.vy = 0;
          }
        }
      }
    }
    // Moving platforms
    for (const plat of this.platforms) {
      if (plat.isBroken) continue;
      if (this.aabb(entity, plat)) {
        if (entity.vy > 0 && entity.y + entity.height - entity.vy * this.FIXED_DT <= plat.y + 5) {
          entity.y = plat.y - entity.height - 0.1;
          entity.vy = 0;
          entity.isGrounded = true;
          entity.x += (plat.moveAxis === 'x' ? plat.moveSpeed : 0) * this.FIXED_DT * Math.sin(Date.now() / 1000);
        }
      }
    }
  }

  // ============ ENEMY AI ============
  updateEnemies(dt: number) {
    for (const e of this.enemies) {
      if (e.isDead) continue;
      e.hurtTimer = Math.max(0, e.hurtTimer - dt);
      e.stunTimer = Math.max(0, e.stunTimer - dt);
      e.attackCooldown = Math.max(0, e.attackCooldown - dt);
      e.isHurt = e.hurtTimer > 0;
      if (e.isStunned && e.stunTimer <= 0) e.isStunned = false;

      const distToPlayer = Math.hypot(this.player.x - e.x, this.player.y - e.y);
      const canSeePlayer = distToPlayer < e.detectRange && !this.player.isDead;

      switch (e.type) {
        case 'wraith':
          if (canSeePlayer && !e.isStunned) {
            e.state = 'chase';
            const dx = this.player.x - e.x;
            e.facing = dx > 0 ? 1 : -1;
            if (Math.abs(dx) > e.attackRange) e.x += e.facing * e.moveSpeed * dt;
            else if (e.attackCooldown <= 0) {
              e.isAttacking = true;
              e.attackCooldown = 1.0;
              if (this.aabb(this.player, e) && this.player.invincibleTimer <= 0) {
                this.damagePlayer(e.damage);
              }
              setTimeout(() => e.isAttacking = false, 400);
            }
          } else {
            e.state = 'patrol';
            e.x += e.facing * (e.moveSpeed * 0.4) * dt;
            if (e.x <= e.patrolStart || e.x >= e.patrolEnd) e.facing *= -1;
          }
          break;

        case 'shield_knight':
          if (canSeePlayer && !e.isStunned) {
            const dx = this.player.x - e.x;
            e.facing = dx > 0 ? 1 : -1;
            e.isShielded = Math.abs(dx) > e.attackRange;
            e.state = e.isShielded ? 'shield' : 'attack';
            if (Math.abs(dx) > e.attackRange + 20) e.x += e.facing * e.moveSpeed * 0.5 * dt;
            else if (e.attackCooldown <= 0 && !e.isShielded) {
              e.isAttacking = true;
              e.attackCooldown = 1.2;
              if (this.aabb(this.player, e) && this.player.invincibleTimer <= 0) {
                this.damagePlayer(e.damage * 1.5);
              }
              setTimeout(() => e.isAttacking = false, 500);
            }
          } else {
            e.isShielded = true;
            e.state = 'idle';
          }
          break;

        case 'bat':
          e.y += Math.sin(Date.now() / 500 + e.x) * 40 * dt;
          if (canSeePlayer && !e.isStunned) {
            e.state = 'chase';
            const angle = Math.atan2(this.player.y - e.y, this.player.x - e.x);
            e.x += Math.cos(angle) * e.moveSpeed * dt;
            e.y += Math.sin(angle) * e.moveSpeed * dt;
          } else {
            e.state = 'patrol';
            e.x += e.facing * e.moveSpeed * 0.5 * dt;
            if (e.x <= e.patrolStart || e.x >= e.patrolEnd) e.facing *= -1;
          }
          // Keep in bounds
          e.y = Math.max(50, Math.min(this.level.height - 100, e.y));
          break;

        case 'charger':
          if (canSeePlayer && !e.isStunned) {
            e.state = 'chase';
            const dx = this.player.x - e.x;
            e.facing = dx > 0 ? 1 : -1;
            const chargeSpeed = e.isAttacking ? e.moveSpeed * 2.5 : e.moveSpeed;
            if (Math.abs(dx) > e.attackRange * 1.5) e.x += e.facing * e.moveSpeed * dt;
            else if (e.attackCooldown <= 0) {
              e.isAttacking = true;
              e.attackCooldown = 2.0;
            }
            if (e.isAttacking) {
              e.x += e.facing * chargeSpeed * dt;
              if (this.aabb(this.player, e) && this.player.invincibleTimer <= 0) {
                this.damagePlayer(e.damage);
                this.player.vx = e.facing * 400;
                e.isAttacking = false;
              }
              // Stop charging after distance
              const chargeDist = Math.abs(e.x - (e.patrolStart + e.patrolEnd) / 2);
              if (chargeDist > 300) e.isAttacking = false;
            }
          } else { e.state = 'patrol'; e.isAttacking = false; }
          break;

        case 'shooter':
          if (canSeePlayer && !e.isStunned) {
            e.state = 'attack';
            const dx = this.player.x - e.x;
            e.facing = dx > 0 ? 1 : -1;
            if (e.attackCooldown <= 0) {
              e.attackCooldown = 1.5;
              this.projectiles.push({
                x: e.x + e.width / 2, y: e.y + e.height / 3,
                vx: e.facing * 250, vy: 0, width: 12, height: 6,
                damage: e.damage, isEnemy: true, life: 3, type: 'magic',
              });
            }
          } else { e.state = 'idle'; }
          break;

        case 'jumper':
          if (canSeePlayer && !e.isStunned) {
            e.state = 'chase';
            const dx = this.player.x - e.x;
            e.facing = dx > 0 ? 1 : -1;
            if (Math.abs(dx) > e.attackRange) e.x += e.facing * e.moveSpeed * dt;
            if (e.isGrounded && Math.random() < 0.02) {
              e.vy = -500;
              e.isGrounded = false;
            }
            e.vy += GRAVITY * dt;
            e.y += e.vy * dt;
            this.resolveCollisionY(e);
            if (this.aabb(this.player, e) && this.player.invincibleTimer <= 0) {
              this.damagePlayer(e.damage);
            }
          } else {
            e.state = 'patrol';
            e.x += e.facing * (e.moveSpeed * 0.3) * dt;
            if (e.x <= e.patrolStart || e.x >= e.patrolEnd) e.facing *= -1;
          }
          break;

        case 'boss_gatekeeper':
          this.updateBoss(e, dt, distToPlayer, canSeePlayer);
          break;
      }

      // Basic physics for non-flying enemies
      if (e.type !== 'bat' && e.type !== 'boss_gatekeeper') {
        e.vy = (e.vy || 0) + GRAVITY * dt;
        if (e.vy > MAX_FALL_SPEED) e.vy = MAX_FALL_SPEED;
        // Simple ground check
        const footTile = this.getTileAt(e.x + e.width / 2, e.y + e.height + 2);
        if (this.isSolidTile(footTile)) {
          e.vy = 0;
          e.isGrounded = true;
        } else {
          e.isGrounded = false;
          e.y += e.vy * dt;
        }
      }

      // Rage mode
      if (e.hp < e.maxHp * 0.3 && !e.rageMode && e.type !== 'bat') {
        e.rageMode = true;
        e.moveSpeed *= 1.4;
        e.damage = Math.floor(e.damage * 1.3);
        this.floatingTexts.push({ x: e.x, y: e.y - 30, text: 'ENRAGED!', color: '#FF4800', life: 2, vy: -30, fontSize: 18 });
      }
    }
  }

  updateBoss(boss: EnemyState, dt: number, distToPlayer: number, canSeePlayer: boolean) {
    boss.hurtTimer = Math.max(0, boss.hurtTimer - dt);
    // Phase transitions
    if (boss.hp < boss.maxHp * 0.5 && boss.phase === 1) {
      boss.phase = 2;
      boss.moveSpeed *= 1.3;
      this.floatingTexts.push({ x: boss.x, y: boss.y - 50, text: 'PHASE 2!', color: '#FF4800', life: 2.5, vy: -30, fontSize: 22 });
      this.screenShake(8, 0.5);
    }

    if (!canSeePlayer || boss.isStunned) { boss.state = 'idle'; return; }

    const dx = this.player.x - boss.x;
    boss.facing = dx > 0 ? 1 : -1;
    boss.state = 'attack';

    // Attack patterns based on phase
    if (boss.attackCooldown <= 0) {
      const attackRoll = Math.random();
      if (boss.phase === 1) {
        if (attackRoll < 0.4) {
          // Slash attack
          boss.attackCooldown = 1.5;
          boss.isAttacking = true;
          if (distToPlayer < boss.attackRange * 1.5 && this.player.invincibleTimer <= 0) {
            this.damagePlayer(boss.damage);
            this.player.vx = boss.facing * 500;
          }
          setTimeout(() => boss.isAttacking = false, 500);
        } else if (attackRoll < 0.7) {
          // Projectile
          boss.attackCooldown = 2.0;
          for (let i = -1; i <= 1; i++) {
            this.projectiles.push({
              x: boss.x + boss.width / 2, y: boss.y + boss.height / 3 + i * 15,
              vx: boss.facing * 200, vy: i * 60, width: 16, height: 10,
              damage: boss.damage * 0.7, isEnemy: true, life: 4, type: 'fireball',
            });
          }
        } else {
          // Charge
          boss.attackCooldown = 2.5;
          boss.isAttacking = true;
          const chargeDir = boss.facing;
          let chargeDist = 0;
          const chargeInterval = setInterval(() => {
            if (boss.isDead) { clearInterval(chargeInterval); return; }
            boss.x += chargeDir * 500 * 0.016;
            chargeDist += 500 * 0.016;
            if (this.aabb(this.player, boss) && this.player.invincibleTimer <= 0) {
              this.damagePlayer(boss.damage * 1.5);
              this.player.vx = chargeDir * 600;
            }
            if (chargeDist > 400) { clearInterval(chargeInterval); boss.isAttacking = false; }
          }, 16);
        }
      } else {
        // Phase 2: faster, more projectiles, teleport
        if (attackRoll < 0.3) {
          boss.attackCooldown = 1.0;
          if (distToPlayer < boss.attackRange * 2 && this.player.invincibleTimer <= 0) {
            this.damagePlayer(boss.damage * 1.2);
          }
        } else if (attackRoll < 0.6) {
          boss.attackCooldown = 1.5;
          for (let i = -2; i <= 2; i++) {
            this.projectiles.push({
              x: boss.x + boss.width / 2, y: boss.y + boss.height / 3 + i * 12,
              vx: boss.facing * 280, vy: i * 50, width: 14, height: 8,
              damage: boss.damage * 0.8, isEnemy: true, life: 4, type: 'fireball',
            });
          }
        } else {
          // Teleport behind player
          boss.attackCooldown = 2.0;
          this.spawnParticles(boss.x + boss.width / 2, boss.y + boss.height / 2, 15, 'magic');
          boss.x = this.player.x - boss.facing * 80;
          boss.y = this.player.y;
          this.spawnParticles(boss.x + boss.width / 2, boss.y + boss.height / 2, 15, 'magic');
        }
      }
    }

    // Keep boss in arena
    boss.x = Math.max(100, Math.min(this.level.width - 200, boss.x));
    boss.y = Math.max(100, Math.min(this.level.height - 200, boss.y));
  }

  // ============ PROJECTILES ============
  updateProjectiles(dt: number) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) { this.projectiles.splice(i, 1); continue; }
      if (p.x < 0 || p.x > this.level.width || p.y < 0 || p.y > this.level.height) {
        this.projectiles.splice(i, 1); continue;
      }
      // Hit player
      if (p.isEnemy && this.aabb(p, this.player) && this.player.invincibleTimer <= 0) {
        this.damagePlayer(p.damage);
        this.projectiles.splice(i, 1);
        continue;
      }
      // Hit solid tile
      if (this.isSolidTile(this.getTileAt(p.x, p.y))) {
        this.spawnParticles(p.x, p.y, 5, 'hit');
        this.projectiles.splice(i, 1);
      }
    }
  }

  // ============ COLLECTIBLES ============
  updateCollectibles(dt: number) {
    for (const c of this.collectibles) {
      if (c.collected) continue;
      c.bobOffset += dt * 3;
      c.y += Math.sin(c.bobOffset) * 0.3;

      // Magnet
      const dist = Math.hypot(this.player.x - c.x, this.player.y - c.y);
      if (dist < 120) c.magnetized = true;
      if (c.magnetized && dist > 10) {
        const angle = Math.atan2(this.player.y - c.y, this.player.x - c.x);
        c.x += Math.cos(angle) * 300 * dt;
        c.y += Math.sin(angle) * 300 * dt;
      }

      if (this.aabb(this.player, c)) {
        c.collected = true;
        this.collectItem(c);
      }
    }
    this.collectibles = this.collectibles.filter(c => !c.collected);
  }

  collectItem(c: CollectibleState) {
    const p = this.player;
    switch (c.type) {
      case 'coin':
        p.coins += c.value;
        this.spawnParticles(c.x + 12, c.y + 12, 5, 'coin');
        this.floatingTexts.push({ x: c.x, y: c.y, text: `+${c.value}`, color: '#D4A843', life: 0.8, vy: -30, fontSize: 14 });
        break;
      case 'gem':
        p.gems += 1;
        this.spawnParticles(c.x + 12, c.y + 12, 8, 'magic');
        this.floatingTexts.push({ x: c.x, y: c.y, text: 'GEM!', color: '#4CC9F0', life: 1, vy: -30, fontSize: 16 });
        break;
      case 'health':
        p.hp = Math.min(p.maxHp, p.hp + c.value);
        this.floatingTexts.push({ x: c.x, y: c.y, text: `+${c.value} HP`, color: '#4ade80', life: 1, vy: -30, fontSize: 14 });
        break;
      case 'energy':
        p.energy = Math.min(p.maxEnergy, p.energy + c.value);
        this.floatingTexts.push({ x: c.x, y: c.y, text: `+${c.value} EN`, color: '#4CC9F0', life: 1, vy: -30, fontSize: 14 });
        break;
      case 'chest':
        p.coins += c.value;
        this.spawnParticles(c.x + 24, c.y + 24, 15, 'coin');
        this.floatingTexts.push({ x: c.x, y: c.y, text: `CHEST! +${c.value}`, color: '#D4A843', life: 1.5, vy: -30, fontSize: 18 });
        break;
    }
    this.onScoreUpdate?.(this.getScore(), p.coins, this.combo.count);
    this.onHpUpdate?.(p.hp, p.maxHp);
  }

  // ============ CHECKPOINTS ============
  updateCheckpoints() {
    for (const cp of this.checkpoints) {
      if (cp.activated) continue;
      if (this.aabb(this.player, cp)) {
        cp.activated = true;
        this.floatingTexts.push({ x: cp.x, y: cp.y - 20, text: 'Checkpoint!', color: '#4CC9F0', life: 1.5, vy: -20, fontSize: 14 });
        this.spawnParticles(cp.x + 16, cp.y, 10, 'magic');
      }
    }
  }

  // ============ MOVING PLATFORMS ============
  updatePlatforms(dt: number) {
    for (const plat of this.platforms) {
      if (plat.isBroken) continue;
      if (plat.type !== 'moving') continue;
      plat.currentPos += plat.moveSpeed * dt;
      const offset = Math.sin(plat.currentPos / 100) * plat.moveRange;
      if (plat.moveAxis === 'x') plat.x = plat.moveOrigin + offset;
      else plat.y = plat.moveOrigin + offset;
    }
  }

  // ============ PORTALS ============
  updatePortals() {
    for (const portal of this.portals) {
      if (!portal.isActive || !portal.isExit) continue;
      if (this.aabb(this.player, portal)) {
        // Activate boss portal if boss dead
        if (this.level.isBossLevel) {
          const bossAlive = this.enemies.some(e => e.type === 'boss_gatekeeper' && !e.isDead);
          if (!bossAlive) {
            const score = this.getScore();
            const stars = this.calculateStars();
            this.onVictory?.(score, stars, this.gameTime);
          }
        } else {
          const score = this.getScore();
          const stars = this.calculateStars();
          this.onVictory?.(score, stars, this.gameTime);
        }
      }
    }
  }

  // ============ COMBAT ============
  damageEnemy(e: EnemyState, damage: number, knockbackDir: number) {
    if (e.isDead || e.isStunned) return;
    // Shield check
    if (e.isShielded && e.type === 'shield_knight') {
      const facingPlayer = (e.facing > 0 && this.player.x > e.x) || (e.facing < 0 && this.player.x < e.x);
      if (facingPlayer) {
        this.floatingTexts.push({ x: e.x, y: e.y - 10, text: 'BLOCKED', color: '#8D99AE', life: 0.6, vy: -20, fontSize: 12 });
        this.spawnParticles(e.x + e.width / 2, e.y + e.height / 2, 5, 'hit');
        return;
      }
    }
    const isCrit = Math.random() < 0.15;
    const finalDmg = isCrit ? Math.floor(damage * 2) : damage;
    e.hp -= finalDmg;
    e.isHurt = true;
    e.hurtTimer = 0.3;
    e.vx = knockbackDir * 150;
    this.damageNumbers.push({ x: e.x + e.width / 2, y: e.y, value: finalDmg, isCritical: isCrit, life: 1, vy: -80, color: isCrit ? '#FF4800' : '#F8F9FA' });
    this.spawnParticles(e.x + e.width / 2, e.y + e.height / 2, isCrit ? 10 : 5, 'blood');
    this.screenShake(isCrit ? 6 : 3, 0.1);
    this.updateCombo(true);

    if (e.hp <= 0) {
      e.hp = 0;
      e.isDead = true;
      this.player.xp += e.scoreValue / 10;
      // Drops
      for (const drop of e.dropTable) {
        if (Math.random() < drop.chance) {
          const count = drop.minCount + Math.floor(Math.random() * (drop.maxCount - drop.minCount + 1));
          for (let i = 0; i < count; i++) {
            this.collectibles.push({
              id: `drop_${Math.random()}`, x: e.x + Math.random() * e.width, y: e.y,
              type: drop.type, value: drop.type === 'coin' ? 10 : drop.type === 'gem' ? 50 : 25,
              collected: false, bobOffset: Math.random() * 6, magnetized: false,
              animFrame: 0, width: 24, height: 24,
            });
          }
        }
      }
      this.spawnParticles(e.x + e.width / 2, e.y + e.height / 2, 20, 'blood');
      this.floatingTexts.push({ x: e.x, y: e.y - 20, text: `+${e.scoreValue}`, color: '#D4A843', life: 1, vy: -25, fontSize: 16 });
      // Screen flash on boss death
      if (e.type === 'boss_gatekeeper') {
        this.screenShake(12, 0.5);
        // Activate portal
        for (const p of this.portals) { p.isActive = true; }
      }
    }
  }

  damagePlayer(damage: number) {
    const p = this.player;
    if (p.isDead || p.invincibleTimer > 0) return;
    p.hp -= damage;
    p.isHurt = true;
    p.invincibleTimer = INVINCIBLE_TIME;
    p.vx = -p.facing * 250;
    p.vy = -200;
    this.spawnParticles(p.x + p.width / 2, p.y + p.height / 2, 8, 'blood');
    this.damageNumbers.push({ x: p.x, y: p.y, value: damage, isCritical: false, life: 1, vy: -60, color: '#E63946' });
    this.screenShake(5, 0.15);
    this.updateCombo(false);
    this.onHpUpdate?.(Math.max(0, p.hp), p.maxHp);
    if (p.hp <= 0) {
      p.hp = 0;
      p.isDead = true;
      this.spawnParticles(p.x + p.width / 2, p.y + p.height / 2, 20, 'blood');
      setTimeout(() => this.onGameOver?.(), 1500);
    }
  }

  getScore(): number {
    const p = this.player;
    const enemyScore = this.enemies.filter(e => e.isDead).reduce((s, e) => s + e.scoreValue, 0);
    const timeBonus = Math.max(0, Math.floor((this.level.targetTime - this.gameTime) * 10));
    const noDamageBonus = p.hp >= p.maxHp ? 1000 : 0;
    return enemyScore + p.coins * 10 + p.gems * 50 + timeBonus + noDamageBonus;
  }

  calculateStars(): number {
    let stars = 1; // completed
    if (this.gameTime <= this.level.targetTime) stars = 2;
    if (stars === 2 && this.player.hp >= this.player.maxHp) stars = 3;
    return stars;
  }

  // ============ PARTICLES ============
  spawnParticles(x: number, y: number, count: number, type: Particle['type']) {
    const colors: Record<string, string[]> = {
      dust: ['#8D99AE', '#6b7280', '#9ca3af'],
      spark: ['#4CC9F0', '#D4A843', '#F8F9FA'],
      blood: ['#E63946', '#FF4800', '#8B0000'],
      magic: ['#4CC9F0', '#7c3aed', '#D4A843'],
      coin: ['#D4A843', '#fbbf24', '#f59e0b'],
      hit: ['#F8F9FA', '#E63946', '#4CC9F0'],
      trail: ['#4CC9F060', '#4CC9F030'],
      explosion: ['#FF4800', '#E63946', '#D4A843', '#F8F9FA'],
    };
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 300,
        vy: (Math.random() - 0.5) * 300 - (type === 'dust' || type === 'explosion' ? 100 : 0),
        life: 0.5 + Math.random() * 0.5,
        maxLife: 1,
        size: 2 + Math.random() * 4,
        color: colors[type][Math.floor(Math.random() * colors[type].length)],
        gravity: type === 'dust' || type === 'explosion' ? 400 : type === 'spark' ? 100 : 0,
        alpha: 1,
        type,
      });
    }
  }

  updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.gravity * dt;
      p.life -= dt;
      p.alpha = Math.max(0, p.life / p.maxLife);
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  updateDamageNumbers(dt: number) {
    for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
      const d = this.damageNumbers[i];
      d.y += d.vy * dt;
      d.life -= dt;
      if (d.life <= 0) this.damageNumbers.splice(i, 1);
    }
  }

  updateFloatingTexts(dt: number) {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.y += t.vy * dt;
      t.life -= dt;
      if (t.life <= 0) this.floatingTexts.splice(i, 1);
    }
  }

  // ============ CAMERA ============
  updateCamera(dt: number) {
    const c = this.camera;
    // Smooth follow
    c.x += (c.targetX - c.x) * 5 * dt;
    c.y += (c.targetY - c.y) * 5 * dt;
    // Clamp to level bounds
    c.x = Math.max(0, Math.min(this.level.width - this.canvas.width, c.x));
    c.y = Math.max(0, Math.min(this.level.height - this.canvas.height, c.y));
    // Screen shake
    if (c.shakeIntensity > 0) {
      c.shakeX = (Math.random() - 0.5) * c.shakeIntensity * 2;
      c.shakeY = (Math.random() - 0.5) * c.shakeIntensity * 2;
      c.shakeIntensity *= Math.exp(-c.shakeDecay * dt * 10);
      if (c.shakeIntensity < 0.5) { c.shakeIntensity = 0; c.shakeX = 0; c.shakeY = 0; }
    }
  }

  screenShake(intensity: number, duration: number) {
    this.camera.shakeIntensity = intensity;
    this.camera.shakeDecay = 1 / (duration || 0.1);
  }

  // ============ COMBO ============
  updateCombo(hit: boolean) {
    if (!hit) {
      this.combo.timer = Math.max(0, this.combo.timer - 1);
      if (this.combo.timer <= 0) this.combo.count = 0;
      return;
    }
    const newCount = this.combo.timer > 0 ? this.combo.count + 1 : 1;
    const mult = 1 + Math.floor(newCount / 3) * 0.5;
    this.combo.count = newCount;
    this.combo.timer = 120;
    this.combo.maxCombo = Math.max(this.combo.maxCombo, newCount);
    this.combo.multiplier = Math.min(mult, 5);
  }

  // ============ RENDERING ============
  render(_alpha: number) {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const camX = this.camera.x + this.camera.shakeX;
    const camY = this.camera.y + this.camera.shakeY;

    ctx.clearRect(0, 0, W, H);

    // Background image (parallax)
    if (this.bgImage && this.bgImage.complete) {
      const parallaxX = camX * this.level.parallaxSpeed * 0.3;
      const scale = Math.max(W / this.bgImage.width, H / this.bgImage.height) * 1.2;
      const drawW = this.bgImage.width * scale;
      const drawH = this.bgImage.height * scale;
      ctx.drawImage(this.bgImage, -parallaxX % drawW - drawW * 0.1, -drawH * 0.1 + (H - drawH) * 0.5, drawW, drawH);
    } else {
      ctx.fillStyle = '#1A1A24';
      ctx.fillRect(0, 0, W, H);
    }

    ctx.save();
    ctx.translate(-camX, -camY);

    // Tiles
    const startTX = Math.max(0, Math.floor(camX / 48));
    const endTX = Math.min(this.tileWidth, Math.ceil((camX + W) / 48) + 1);
    const startTY = Math.max(0, Math.floor(camY / 48));
    const endTY = Math.min(this.tileHeight, Math.ceil((camY + H) / 48) + 1);

    for (let ty = startTY; ty < endTY; ty++) {
      for (let tx = startTX; tx < endTX; tx++) {
        const tile = this.level.tiles[ty]?.[tx] ?? 0;
        if (tile === 0) continue;
        const color = TILE_COLORS[tile] || '#444';
        const x = tx * 48;
        const y = ty * 48;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 48, 48);

        // Tile detail
        if (tile === 1) {
          ctx.fillStyle = '#4a4a5e';
          ctx.fillRect(x + 2, y + 2, 44, 4);
          ctx.fillStyle = '#2a2a3e';
          ctx.fillRect(x + 4, y + 42, 40, 4);
        } else if (tile === 2) {
          ctx.fillStyle = '#5a5a6e';
          ctx.fillRect(x, y, 48, 6);
          ctx.fillStyle = '#3a3a4e';
          ctx.fillRect(x + 4, y + 8, 8, 4);
          ctx.fillRect(x + 20, y + 8, 8, 4);
          ctx.fillRect(x + 36, y + 8, 8, 4);
        } else if (tile === 3) {
          // Spikes
          ctx.fillStyle = '#e63946';
          for (let s = 0; s < 4; s++) {
            ctx.beginPath();
            ctx.moveTo(x + s * 12 + 2, y + 48);
            ctx.lineTo(x + s * 12 + 8, y + 8);
            ctx.lineTo(x + s * 12 + 14, y + 48);
            ctx.fill();
          }
        } else if (tile === 4) {
          // Lava glow
          ctx.fillStyle = `rgba(255, 72, 0, ${0.5 + Math.sin(Date.now() / 300 + tx) * 0.3})`;
          ctx.fillRect(x, y, 48, 48);
        } else if (tile === 5) {
          ctx.fillStyle = '#8b6914';
          ctx.fillRect(x + 4, y + 4, 40, 40);
          ctx.fillStyle = '#a08020';
          ctx.fillRect(x + 8, y + 8, 32, 6);
        } else if (tile === 6) {
          ctx.fillStyle = '#a8d8ea80';
          ctx.fillRect(x, y, 48, 48);
        } else if (tile === 7) {
          // Bounce pad
          ctx.fillStyle = '#9b59b6';
          ctx.fillRect(x + 8, y + 20, 32, 28);
          ctx.fillStyle = '#8e44ad';
          ctx.beginPath();
          ctx.arc(x + 24, y + 20, 20, Math.PI, 0);
          ctx.fill();
        } else if (tile === 8) {
          // Checkpoint
          const activated = this.checkpoints.some(cp => cp.activated && Math.floor(cp.x / 48) === tx && Math.floor(cp.y / 48) === ty);
          ctx.fillStyle = activated ? '#4CC9F0' : '#555';
          ctx.fillRect(x + 16, y, 16, 48);
          ctx.fillStyle = activated ? '#4CC9F080' : '#55580';
          ctx.beginPath();
          ctx.arc(x + 24, y - 8, 16, 0, Math.PI * 2);
          ctx.fill();
        } else if (tile === 9) {
          // Portal
          ctx.fillStyle = `rgba(76, 201, 240, ${0.4 + Math.sin(Date.now() / 400) * 0.3})`;
          ctx.fillRect(x, y, 48, 64);
        } else if (tile === 10) {
          // Vine
          ctx.fillStyle = '#2d5a27';
          ctx.fillRect(x + 18, y, 12, 48);
          ctx.fillStyle = '#3a7a34';
          for (let vy = 0; vy < 48; vy += 8) {
            ctx.fillRect(x + 12 + Math.sin(vy * 0.5) * 6, y + vy, 8, 4);
          }
        } else if (tile === 13) {
          // Secret wall
          ctx.fillStyle = '#4a4a5e80';
          ctx.fillRect(x, y, 48, 48);
        }
      }
    }

    // Moving platforms
    for (const plat of this.platforms) {
      if (plat.isBroken) continue;
      ctx.fillStyle = plat.type === 'moving' ? '#6a6a7e' : plat.type === 'breakable' ? '#8b6914' : plat.type === 'ice' ? '#a8d8ea' : '#4a4a5e';
      ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
      if (plat.type === 'moving') {
        ctx.fillStyle = '#7a7a8e';
        ctx.fillRect(plat.x + 4, plat.y + 4, plat.width - 8, 6);
      }
    }

    // Hazards
    for (const h of this.hazards) {
      if (h.type === 'lava') {
        ctx.fillStyle = `rgba(255, 72, 0, ${0.6 + Math.sin(Date.now() / 400) * 0.2})`;
        ctx.fillRect(h.x, h.y, h.width, h.height);
      }
    }

    // Checkpoints
    for (const cp of this.checkpoints) {
      const glowColor = cp.activated ? '#4CC9F0' : '#555';
      ctx.fillStyle = glowColor;
      ctx.fillRect(cp.x + 10, cp.y, 12, 80);
      ctx.fillStyle = glowColor + '60';
      ctx.beginPath();
      ctx.arc(cp.x + 16, cp.y, 20 + Math.sin(Date.now() / 500) * 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Portals
    for (const portal of this.portals) {
      if (!portal.isActive) continue;
      ctx.fillStyle = `rgba(76, 201, 240, ${0.3 + Math.sin(Date.now() / 300) * 0.2})`;
      ctx.fillRect(portal.x - 10, portal.y - 20, portal.width + 20, portal.height + 40);
      ctx.fillStyle = `rgba(212, 168, 67, ${0.5 + Math.sin(Date.now() / 400) * 0.3})`;
      ctx.fillRect(portal.x, portal.y, portal.width, portal.height);
    }

    // Collectibles
    for (const c of this.collectibles) {
      if (c.collected) continue;
      ctx.save();
      ctx.translate(c.x + 12, c.y + 12);
      const bob = Math.sin(c.bobOffset) * 3;
      ctx.translate(0, bob);
      if (c.type === 'coin') {
        ctx.fillStyle = '#D4A843';
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#D4A843';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('$', 0, 4);
      } else if (c.type === 'gem') {
        ctx.fillStyle = '#4CC9F0';
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(8, 0);
        ctx.lineTo(0, 10);
        ctx.lineTo(-8, 0);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#7dd3fc';
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(5, 0);
        ctx.lineTo(0, 6);
        ctx.lineTo(-5, 0);
        ctx.closePath();
        ctx.fill();
      } else if (c.type === 'health') {
        ctx.fillStyle = '#E63946';
        const s = 8 + Math.sin(Date.now() / 400) * 2;
        ctx.fillRect(-s / 4, -s, s / 2, s * 2);
        ctx.fillRect(-s, -s / 4, s * 2, s / 2);
      } else if (c.type === 'chest') {
        ctx.fillStyle = '#8b6914';
        ctx.fillRect(-14, -8, 28, 16);
        ctx.fillStyle = '#D4A843';
        ctx.fillRect(-14, -8, 28, 4);
      }
      ctx.restore();
    }

    // Projectiles
    for (const proj of this.projectiles) {
      if (proj.type === 'magic') {
        ctx.fillStyle = '#4CC9F0';
        ctx.beginPath();
        ctx.arc(proj.x + proj.width / 2, proj.y + proj.height / 2, 6, 0, Math.PI * 2);
        ctx.fill();
      } else if (proj.type === 'fireball') {
        ctx.fillStyle = '#FF4800';
        ctx.beginPath();
        ctx.arc(proj.x + proj.width / 2, proj.y + proj.height / 2, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#E63946';
        ctx.beginPath();
        ctx.arc(proj.x + proj.width / 2, proj.y + proj.height / 2, 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#F8F9FA';
        ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
      }
    }

    // Enemies
    for (const e of this.enemies) {
      if (e.isDead) continue;
      ctx.save();
      ctx.translate(e.x + e.width / 2, e.y + e.height / 2);
      if (e.facing < 0) ctx.scale(-1, 1);
      // Flash white when hurt
      if (e.isHurt) {
        ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.05) * 0.5;
      }

      if (e.type === 'wraith') {
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(0, -5, 16, 0, Math.PI * 2);
        ctx.fill();
        // Eyes
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(-8, -8, 5, 5);
        ctx.fillRect(3, -8, 5, 5);
        // Cloak
        ctx.fillStyle = '#2d2d3a';
        ctx.beginPath();
        ctx.moveTo(-16, 0);
        ctx.lineTo(16, 0);
        ctx.lineTo(12, 18);
        ctx.lineTo(-12, 18);
        ctx.closePath();
        ctx.fill();
      } else if (e.type === 'shield_knight') {
        ctx.fillStyle = e.isShielded ? '#5a5a6e' : '#4a4a5e';
        ctx.fillRect(-20, -28, 40, 50);
        // Shield
        if (e.isShielded) {
          ctx.fillStyle = '#6b7280';
          ctx.fillRect(12, -20, 10, 35);
        }
        // Eyes
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(-6, -18, 4, 4);
        ctx.fillRect(2, -18, 4, 4);
      } else if (e.type === 'bat') {
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        // Wings
        const wingFlap = Math.sin(Date.now() / 100) * 15;
        ctx.fillStyle = '#2d2d3a';
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.lineTo(-28, -10 + wingFlap);
        ctx.lineTo(-12, 5);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(28, -10 + wingFlap);
        ctx.lineTo(12, 5);
        ctx.fill();
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-4, -3, 3, 3);
        ctx.fillRect(1, -3, 3, 3);
      } else if (e.type === 'boss_gatekeeper') {
        // Boss body
        ctx.fillStyle = e.phase === 2 ? '#7f1d1d' : '#3a1a1a';
        ctx.fillRect(-36, -48, 72, 96);
        // Horns
        ctx.fillStyle = '#D4A843';
        ctx.beginPath();
        ctx.moveTo(-20, -48);
        ctx.lineTo(-30, -70);
        ctx.lineTo(-10, -48);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(20, -48);
        ctx.lineTo(30, -70);
        ctx.lineTo(10, -48);
        ctx.fill();
        // Eyes
        ctx.fillStyle = e.rageMode ? '#FF4800' : '#ef4444';
        ctx.fillRect(-16, -32, 10, 8);
        ctx.fillRect(6, -32, 10, 8);
        // Boss HP bar
        ctx.restore();
        ctx.save();
        ctx.translate(e.x + e.width / 2, e.y - 15);
        ctx.fillStyle = '#1a1a24';
        ctx.fillRect(-40, 0, 80, 8);
        ctx.fillStyle = e.hp < e.maxHp * 0.3 ? '#FF4800' : '#E63946';
        ctx.fillRect(-40, 0, 80 * (e.hp / e.maxHp), 8);
        ctx.fillStyle = '#F8F9FA';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${e.hp}/${e.maxHp}`, 0, 7);
        ctx.restore();
        ctx.save();
        ctx.translate(e.x + e.width / 2, e.y + e.height / 2);
        if (e.facing < 0) ctx.scale(-1, 1);
        // Rage glow
        if (e.rageMode) {
          ctx.fillStyle = 'rgba(255, 72, 0, 0.2)';
          ctx.beginPath();
          ctx.arc(0, 0, 50, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (e.type === 'charger') {
        ctx.fillStyle = '#7f1d1d';
        ctx.fillRect(-18, -20, 36, 40);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-10, -16, 20, 8);
        // Charge indicator
        if (e.isAttacking) {
          ctx.fillStyle = 'rgba(255, 72, 0, 0.5)';
          ctx.beginPath();
          ctx.arc(0, 0, 25, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (e.type === 'shooter') {
        ctx.fillStyle = '#2d2d3a';
        ctx.fillRect(-16, -20, 32, 40);
        ctx.fillStyle = '#4CC9F0';
        ctx.fillRect(-4, -12, 8, 8);
      } else if (e.type === 'jumper') {
        ctx.fillStyle = '#1a3a1a';
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(-5, -5, 4, 4);
        ctx.fillRect(1, -5, 4, 4);
      }

      ctx.restore();
    }

    // Player
    const p = this.player;
    if (!p.isDead) {
      ctx.save();
      ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
      if (p.facing < 0) ctx.scale(-1, 1);

      // Invincibility flash
      if (p.invincibleTimer > 0 && Math.sin(Date.now() * 0.03) > 0) {
        ctx.globalAlpha = 0.3;
      }

      // Dash trail
      if (p.isDashing) {
        ctx.fillStyle = 'rgba(76, 201, 240, 0.3)';
        ctx.fillRect(-30 - p.facing * 20, -26, 30, 52);
      }

      // Body
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(-14, -22, 28, 40);
      // Hood
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.arc(0, -18, 14, Math.PI, 0);
      ctx.fill();
      // Eyes (glow)
      ctx.fillStyle = '#D4A843';
      ctx.fillRect(-6, -16, 4, 4);
      ctx.fillRect(2, -16, 4, 4);
      // Cloak
      ctx.fillStyle = '#7f1d1d';
      ctx.beginPath();
      ctx.moveTo(-14, 0);
      ctx.lineTo(-20, 18);
      ctx.lineTo(-8, 12);
      ctx.lineTo(0, 18);
      ctx.lineTo(8, 12);
      ctx.lineTo(20, 18);
      ctx.lineTo(14, 0);
      ctx.fill();

      // Sword (when attacking)
      if (p.isAttacking) {
        ctx.fillStyle = '#c0c0c0';
        ctx.save();
        ctx.translate(16, -5);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(0, -3, 30, 6);
        ctx.fillStyle = '#D4A843';
        ctx.fillRect(-3, -4, 8, 8);
        ctx.restore();
        // Sword swing arc
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(10, -5, 30, -Math.PI / 3, Math.PI / 6);
        ctx.stroke();
      } else {
        // Idle sword
        ctx.fillStyle = '#a0a0a0';
        ctx.fillRect(12, -2, 22, 4);
        ctx.fillStyle = '#8b6914';
        ctx.fillRect(10, -4, 6, 8);
      }

      ctx.restore();
    }

    // Particles
    for (const part of this.particles) {
      ctx.globalAlpha = part.alpha;
      ctx.fillStyle = part.color;
      ctx.fillRect(part.x - part.size / 2, part.y - part.size / 2, part.size, part.size);
    }
    ctx.globalAlpha = 1;

    // Damage numbers
    for (const d of this.damageNumbers) {
      ctx.globalAlpha = Math.max(0, d.life);
      ctx.fillStyle = d.color;
      ctx.font = `${d.isCritical ? 'bold 20' : 'bold 14'}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(`${d.value}${d.isCritical ? '!' : ''}`, d.x, d.y);
    }
    ctx.globalAlpha = 1;

    // Floating texts
    for (const t of this.floatingTexts) {
      ctx.globalAlpha = Math.max(0, t.life);
      ctx.fillStyle = t.color;
      ctx.font = `${t.fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(t.text, t.x, t.y);
    }
    ctx.globalAlpha = 1;

    ctx.restore();
  }

  // ============ GAME LOOP ============
  gameLoop(timestamp: number) {
    if (!this.running) return;
    const rawDt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    const dt = Math.min(rawDt, 0.05); // Cap delta time

    if (!this.player.isDead && !this.isPaused()) {
      this.gameTime += dt;
      this.accumulator += dt;
      while (this.accumulator >= this.FIXED_DT) {
        this.updatePlayer(this.FIXED_DT);
        this.updateEnemies(this.FIXED_DT);
        this.updateProjectiles(this.FIXED_DT);
        this.updateCollectibles(this.FIXED_DT);
        this.updateCheckpoints();
        this.updatePlatforms(this.FIXED_DT);
        this.updatePortals();
        this.updateParticles(this.FIXED_DT);
        this.updateDamageNumbers(this.FIXED_DT);
        this.updateFloatingTexts(this.FIXED_DT);
        // Combo timer
        if (this.combo.timer > 0) {
          this.combo.timer--;
          if (this.combo.timer <= 0) this.combo.count = 0;
        }
        this.accumulator -= this.FIXED_DT;
      }
    }

    this.updateCamera(dt);
    this.render(this.accumulator / this.FIXED_DT);
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  }

  isPaused(): boolean {
    return false; // Managed externally
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    this.gameLoop(performance.now());
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}

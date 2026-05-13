// ===========================
// Shadow Veil: Awakening - Game Store
// ===========================
import { create } from 'zustand';
import type { GameScreen, GameSettings, SaveData, ComboSystem, FloatingText, DamageNumber } from '@/types/game';

interface GameStore {
  // Screen
  screen: GameScreen;
  prevScreen: GameScreen | null;
  setScreen: (screen: GameScreen) => void;
  goBack: () => void;

  // Current Level
  currentLevel: number;
  setCurrentLevel: (level: number) => void;

  // Game State
  isPaused: boolean;
  isPlaying: boolean;
  isGameOver: boolean;
  isVictory: boolean;
  levelTime: number;
  score: number;
  stars: number;
  combo: ComboSystem;
  damageNumbers: DamageNumber[];
  floatingTexts: FloatingText[];
  pauseGame: () => void;
  resumeGame: () => void;
  startGame: (level: number) => void;
  endGame: (won: boolean, score: number, stars: number, time: number) => void;
  restartLevel: () => void;
  nextLevel: () => void;
  addDamageNumber: (x: number, y: number, value: number, isCrit: boolean) => void;
  addFloatingText: (x: number, y: number, text: string, color: string) => void;
  updateCombo: (hit: boolean) => void;
  resetCombo: () => void;

  // Settings
  settings: GameSettings;
  updateSettings: (settings: Partial<GameSettings>) => void;
  loadSettings: () => void;

  // Save Data
  saveData: SaveData;
  loadSave: () => void;
  saveGame: () => void;
  resetSave: () => void;
  updateSave: (partial: Partial<SaveData>) => void;

  // Loading
  isLoading: boolean;
  loadingProgress: number;
  setLoading: (loading: boolean, progress?: number) => void;

  // Notifications
  notifications: string[];
  addNotification: (msg: string) => void;
  clearNotifications: () => void;

  // Fullscreen
  isFullscreen: boolean;
  toggleFullscreen: () => void;

  // FPS
  fps: number;
  setFps: (fps: number) => void;
}

const DEFAULT_SETTINGS: GameSettings = {
  graphics: {
    quality: 'high',
    fpsLimit: 60,
    shadows: true,
    particles: true,
    screenShake: true,
  },
  audio: {
    masterVolume: 0.8,
    musicVolume: 0.7,
    sfxVolume: 0.9,
  },
  controls: {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    jump: 'z',
    attack: 'x',
    dash: 'c',
    interact: 'e',
    pause: 'Escape',
  },
  mobile: {
    joystickSize: 80,
    buttonSize: 60,
    buttonOpacity: 0.7,
  },
};

const DEFAULT_SAVE: SaveData = {
  version: '1.0',
  player: {
    hp: 100,
    maxHp: 100,
    coins: 0,
    gems: 0,
    xp: 0,
    level: 1,
    lives: 5,
    currentSkin: 'default',
    unlockedSkins: ['default'],
    upgrades: {
      hpLevel: 1,
      attackLevel: 1,
      speedLevel: 1,
      dashLevel: 1,
    },
  },
  levels: {
    1: { unlocked: true, completed: false, stars: 0, bestTime: 0, bestScore: 0, deaths: 0 },
    2: { unlocked: false, completed: false, stars: 0, bestTime: 0, bestScore: 0, deaths: 0 },
    3: { unlocked: false, completed: false, stars: 0, bestTime: 0, bestScore: 0, deaths: 0 },
    4: { unlocked: false, completed: false, stars: 0, bestTime: 0, bestScore: 0, deaths: 0 },
    5: { unlocked: false, completed: false, stars: 0, bestTime: 0, bestScore: 0, deaths: 0 },
    6: { unlocked: false, completed: false, stars: 0, bestTime: 0, bestScore: 0, deaths: 0 },
    7: { unlocked: false, completed: false, stars: 0, bestTime: 0, bestScore: 0, deaths: 0 },
    8: { unlocked: false, completed: false, stars: 0, bestTime: 0, bestScore: 0, deaths: 0 },
    9: { unlocked: false, completed: false, stars: 0, bestTime: 0, bestScore: 0, deaths: 0 },
    10: { unlocked: false, completed: false, stars: 0, bestTime: 0, bestScore: 0, deaths: 0 },
  },
  inventory: [
    { id: 'potion_hp', name: 'Health Potion', type: 'consumable', description: 'Restores 25 HP', icon: 'heart', quantity: 3, maxStack: 99, rarity: 'common', equipped: false, effects: { hpBonus: 25 } },
    { id: 'potion_energy', name: 'Energy Potion', type: 'consumable', description: 'Restores 20 Energy', icon: 'zap', quantity: 2, maxStack: 99, rarity: 'common', equipped: false, effects: { hpBonus: 0 } },
  ],
  achievements: {},
  settings: DEFAULT_SETTINGS,
  stats: {
    totalCoins: 0,
    totalGems: 0,
    totalKills: 0,
    totalDeaths: 0,
    totalPlayTime: 0,
    bestCombo: 0,
    levelsCompleted: 0,
    bossesDefeated: 0,
  },
  lastPlayed: new Date().toISOString(),
  dailyReward: {
    lastClaimed: '',
    streak: 0,
  },
};

export const useGameStore = create<GameStore>((set, get) => ({
  screen: 'mainmenu',
  prevScreen: null,
  setScreen: (screen) => set((s) => ({ prevScreen: s.screen, screen })),
  goBack: () => set((s) => ({ screen: s.prevScreen ?? 'mainmenu', prevScreen: null })),

  currentLevel: 1,
  setCurrentLevel: (currentLevel) => set({ currentLevel }),

  isPaused: false,
  isPlaying: false,
  isGameOver: false,
  isVictory: false,
  levelTime: 0,
  score: 0,
  stars: 0,
  combo: { count: 0, timer: 0, maxCombo: 0, multiplier: 1 },
  damageNumbers: [],
  floatingTexts: [],
  pauseGame: () => set({ isPaused: true }),
  resumeGame: () => set({ isPaused: false }),
  startGame: (level) => set({
    currentLevel: level,
    isPlaying: true,
    isPaused: false,
    isGameOver: false,
    isVictory: false,
    levelTime: 0,
    score: 0,
    stars: 0,
    combo: { count: 0, timer: 0, maxCombo: 0, multiplier: 1 },
    damageNumbers: [],
    floatingTexts: [],
    screen: 'playing',
  }),
  endGame: (won, score, stars, time) => set({
    isPlaying: false,
    isGameOver: !won,
    isVictory: won,
    score,
    stars,
    levelTime: time,
    screen: won ? 'victory' : 'gameover',
  }),
  restartLevel: () => set(() => ({
    isPlaying: true,
    isPaused: false,
    isGameOver: false,
    isVictory: false,
    levelTime: 0,
    score: 0,
    stars: 0,
    combo: { count: 0, timer: 0, maxCombo: 0, multiplier: 1 },
    damageNumbers: [],
    floatingTexts: [],
  })),
  nextLevel: () => set((s) => ({
    currentLevel: Math.min(s.currentLevel + 1, 10),
    isPlaying: true,
    isPaused: false,
    isGameOver: false,
    isVictory: false,
    levelTime: 0,
    score: 0,
    stars: 0,
    combo: { count: 0, timer: 0, maxCombo: 0, multiplier: 1 },
    damageNumbers: [],
    floatingTexts: [],
  })),
  addDamageNumber: (x, y, value, isCrit) => set((s) => ({
    damageNumbers: [...s.damageNumbers, { x, y, value, isCritical: isCrit, life: 1.0, vy: -80, color: isCrit ? '#FF4800' : '#F8F9FA' }].slice(-20),
  })),
  addFloatingText: (x, y, text, color) => set((s) => ({
    floatingTexts: [...s.floatingTexts, { x, y, text, color, life: 1.5, vy: -50, fontSize: 16 }].slice(-10),
  })),
  updateCombo: (hit) => set((s) => {
    if (!hit) return { combo: { ...s.combo, timer: Math.max(0, s.combo.timer - 1) } };
    const newCount = s.combo.timer > 0 ? s.combo.count + 1 : 1;
    const mult = 1 + Math.floor(newCount / 3) * 0.5;
    return {
      combo: {
        count: newCount,
        timer: 120,
        maxCombo: Math.max(s.combo.maxCombo, newCount),
        multiplier: Math.min(mult, 5),
      },
    };
  }),
  resetCombo: () => set({ combo: { count: 0, timer: 0, maxCombo: 0, multiplier: 1 } }),

  settings: DEFAULT_SETTINGS,
  updateSettings: (newSettings) => set((s) => ({
    settings: { ...s.settings, ...newSettings },
  })),
  loadSettings: () => {
    try {
      const saved = localStorage.getItem('shadowveil_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        set((prevState) => ({ settings: { ...prevState.settings, ...parsed } }));
      }
    } catch { /* ignore */ }
  },

  saveData: DEFAULT_SAVE,
  loadSave: () => {
    try {
      const saved = localStorage.getItem('shadowveil_save');
      if (saved) {
        const parsed = JSON.parse(saved);
        set((s) => ({ saveData: { ...s.saveData, ...parsed } }));
      }
    } catch { /* ignore */ }
  },
  saveGame: () => {
    const { saveData, settings } = get();
    try {
      localStorage.setItem('shadowveil_save', JSON.stringify(saveData));
      localStorage.setItem('shadowveil_settings', JSON.stringify(settings));
    } catch { /* ignore */ }
  },
  resetSave: () => {
    localStorage.removeItem('shadowveil_save');
    localStorage.removeItem('shadowveil_settings');
    set({ saveData: { ...DEFAULT_SAVE }, settings: { ...DEFAULT_SETTINGS } });
  },
  updateSave: (partial) => set((s) => ({
    saveData: { ...s.saveData, ...partial },
  })),

  isLoading: false,
  loadingProgress: 0,
  setLoading: (loading, progress) => set({ isLoading: loading, loadingProgress: progress ?? 0 }),

  notifications: [],
  addNotification: (msg) => set((s) => ({ notifications: [...s.notifications.slice(-4), msg] })),
  clearNotifications: () => set({ notifications: [] }),

  isFullscreen: false,
  toggleFullscreen: () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      set({ isFullscreen: true });
    } else {
      document.exitFullscreen().catch(() => {});
      set({ isFullscreen: false });
    }
  },

  fps: 60,
  setFps: (fps) => set({ fps }),
}));

import { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './gameEngine';
import { getLevelById } from '@/levels/levels';
import { useGameStore } from '@/store/gameStore';
import { Pause, RotateCcw, Home, Play, Heart, Zap, Coins, Gem, Crosshair, Move, ChevronUp, Shield } from 'lucide-react';

export default function GameCanvas({ levelId }: { levelId: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hp, setHp] = useState(100);
  const [maxHp, setMaxHp] = useState(100);
  const [energy, setEnergy] = useState(100);
  const [coins, setCoins] = useState(0);
  const [gems, setGems] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const animFrameRef = useRef<number>(0);

  const { endGame, saveData } = useGameStore();

  // Detect mobile
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setShowMobileControls(isMobile || window.innerWidth < 768);
  }, []);

  // Init engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = containerRef.current;
    if (!container) return;

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      canvas.width = w;
      canvas.height = h;
      engineRef.current?.resize(w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    const level = getLevelById(levelId);
    if (!level) return;

    const engine = new GameEngine(canvas);
    engineRef.current = engine;

    // Touch input handlers
    const touchState = { startX: 0, startY: 0, joystickX: 0, joystickY: 0 };
    let touchId: number | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        const rect = canvas.getBoundingClientRect();
        const tx = t.clientX - rect.left;
        const ty = t.clientY - rect.top;
        // Left side = joystick
        if (tx < rect.width * 0.3 && touchId === null) {
          touchId = t.identifier;
          touchState.startX = tx;
          touchState.startY = ty;
          engine.touchState.joystickX = 0;
          engine.touchState.joystickY = 0;
        }
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === touchId) {
          const rect = canvas.getBoundingClientRect();
          const dx = t.clientX - rect.left - touchState.startX;
          const maxDist = 40;
          engine.touchState.joystickX = Math.max(-1, Math.min(1, dx / maxDist));
        }
      }
    };
    const handleTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId) {
          touchId = null;
          engine.touchState.joystickX = 0;
        }
      }
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    engine.initLevel(level, saveData.player.upgrades);
    engine.onHpUpdate = (h, m) => { setHp(h); setMaxHp(m); };
    engine.onScoreUpdate = (s, c, comboCount) => { setScore(s); setCoins(c); setCombo(comboCount); };
    engine.onVictory = (score, stars, time) => {
      endGame(true, score, stars, time);
    };
    engine.onGameOver = () => {
      endGame(false, engine.getScore(), 0, engine.gameTime);
    };

    // HUD update loop
    const updateHud = () => {
      if (engine.running && !engine.player.isDead) {
        setHp(engine.player.hp);
        setEnergy(engine.player.energy);
        setCoins(engine.player.coins);
        setGems(engine.player.gems);
        setScore(engine.getScore());
        setTime(engine.gameTime);
        setCombo(engine.combo.count);
      }
      animFrameRef.current = requestAnimationFrame(updateHud);
    };

    setIsLoading(false);
    engine.start();
    animFrameRef.current = requestAnimationFrame(updateHud);

    return () => {
      engine.stop();
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [levelId]);

  // Pause handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        setIsPaused(prev => {
          const next = !prev;
          if (next) engineRef.current?.stop();
          else engineRef.current?.start();
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleMobileJump = useCallback(() => {
    if (engineRef.current) engineRef.current.touchState.jumpPressed = true;
    setTimeout(() => { if (engineRef.current) engineRef.current.touchState.jumpPressed = false; }, 100);
  }, []);
  const handleMobileAttack = useCallback(() => {
    if (engineRef.current) engineRef.current.touchState.attackPressed = true;
    setTimeout(() => { if (engineRef.current) engineRef.current.touchState.attackPressed = false; }, 100);
  }, []);
  const handleMobileDash = useCallback(() => {
    if (engineRef.current) engineRef.current.touchState.dashPressed = true;
    setTimeout(() => { if (engineRef.current) engineRef.current.touchState.dashPressed = false; }, 100);
  }, []);
  const handlePause = useCallback(() => {
    setIsPaused(true);
    engineRef.current?.stop();
  }, []);
  const handleResume = useCallback(() => {
    setIsPaused(false);
    engineRef.current?.start();
  }, []);
  const handleRestart = useCallback(() => {
    setIsPaused(false);
    const level = getLevelById(levelId);
    if (level && engineRef.current) {
      engineRef.current.initLevel(level, saveData.player.upgrades);
      engineRef.current.start();
    }
  }, [levelId, saveData]);

  const formatTime = (t: number) => {
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden select-none">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A24] z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#D4A843] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#F8F9FA] text-lg font-semibold">Loading Level...</p>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none z-10">
        <div className="flex items-start justify-between p-3 gap-2">
          {/* Left - HP & Energy */}
          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-[#E63946] flex-shrink-0" />
              <div className="flex-1 h-4 bg-[#1A1A24]/80 rounded-full overflow-hidden border border-[#8D99AE]/30">
                <div
                  className="h-full bg-[#E63946] transition-all duration-200 rounded-full"
                  style={{ width: `${(hp / maxHp) * 100}%` }}
                />
              </div>
              <span className="text-[#F8F9FA] text-xs font-mono min-w-[36px] text-right">{hp}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#4CC9F0] flex-shrink-0" />
              <div className="flex-1 h-3 bg-[#1A1A24]/80 rounded-full overflow-hidden border border-[#8D99AE]/30">
                <div
                  className="h-full bg-[#4CC9F0] transition-all duration-200 rounded-full"
                  style={{ width: `${(energy / 100) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Center - Score & Time */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="text-[#D4A843] text-sm font-mono font-bold">{score.toLocaleString()}</div>
            <div className="text-[#8D99AE] text-xs font-mono">{formatTime(time)}</div>
            {combo > 2 && (
              <div className="text-[#FF4800] text-xs font-bold animate-pulse">{combo}x COMBO</div>
            )}
          </div>

          {/* Right - Coins & Controls */}
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-[#D4A843]" />
                <span className="text-[#D4A843] text-xs font-mono">{coins}</span>
              </div>
              <div className="flex items-center gap-1">
                <Gem className="w-3.5 h-3.5 text-[#4CC9F0]" />
                <span className="text-[#4CC9F0] text-xs font-mono">{gems}</span>
              </div>
              <button
                onClick={handlePause}
                className="pointer-events-auto ml-2 p-1.5 bg-[#2D2D3A]/80 rounded-lg border border-[#8D99AE]/30 hover:bg-[#3D3D4A] transition-colors"
              >
                <Pause className="w-4 h-4 text-[#F8F9FA]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Controls */}
      {showMobileControls && (
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-20 p-4">
          <div className="flex items-end justify-between">
            {/* Joystick hint */}
            <div className="pointer-events-auto w-24 h-24 rounded-full bg-[#2D2D3A]/50 border-2 border-[#8D99AE]/30 flex items-center justify-center">
              <Move className="w-8 h-8 text-[#8D99AE]/50" />
            </div>
            {/* Action buttons */}
            <div className="flex flex-col gap-2 items-end pointer-events-auto">
              <div className="flex gap-2">
                <button onTouchStart={handleMobileDash} className="w-14 h-14 rounded-full bg-[#4CC9F0]/30 border-2 border-[#4CC9F0]/60 flex items-center justify-center active:bg-[#4CC9F0]/50">
                  <Shield className="w-6 h-6 text-[#4CC9F0]" />
                </button>
                <button onTouchStart={handleMobileAttack} className="w-16 h-16 rounded-full bg-[#E63946]/30 border-2 border-[#E63946]/60 flex items-center justify-center active:bg-[#E63946]/50">
                  <Crosshair className="w-7 h-7 text-[#E63946]" />
                </button>
              </div>
              <button onTouchStart={handleMobileJump} className="w-16 h-16 rounded-full bg-[#D4A843]/30 border-2 border-[#D4A843]/60 flex items-center justify-center active:bg-[#D4A843]/50">
                <ChevronUp className="w-8 h-8 text-[#D4A843]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pause Menu Overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-40">
          <div className="bg-[#2D2D3A] rounded-2xl p-8 border border-[#D4A843]/30 shadow-2xl max-w-sm w-full mx-4">
            <h2 className="text-[#D4A843] text-2xl font-bold text-center mb-6">PAUSED</h2>
            <div className="flex flex-col gap-3">
              <button onClick={handleResume} className="flex items-center justify-center gap-2 py-3 bg-[#D4A843] text-[#1A1A24] rounded-xl font-bold hover:bg-[#e5b94c] transition-colors">
                <Play className="w-5 h-5" /> Resume
              </button>
              <button onClick={handleRestart} className="flex items-center justify-center gap-2 py-3 bg-[#4CC9F0]/20 text-[#4CC9F0] rounded-xl font-bold border border-[#4CC9F0]/30 hover:bg-[#4CC9F0]/30 transition-colors">
                <RotateCcw className="w-5 h-5" /> Restart
              </button>
              <button
                onClick={() => {
                  engineRef.current?.stop();
                  window.location.href = '/levels';
                }}
                className="flex items-center justify-center gap-2 py-3 bg-[#E63946]/20 text-[#E63946] rounded-xl font-bold border border-[#E63946]/30 hover:bg-[#E63946]/30 transition-colors"
              >
                <Home className="w-5 h-5" /> Quit to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

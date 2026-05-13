import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { useEffect, useRef, useState } from 'react';
import { Play, Settings, Trophy, BookOpen, User, Gift, LogIn, Volume2, VolumeX } from 'lucide-react';

export default function MainMenu() {
  const navigate = useNavigate();
  const { saveData, loadSave } = useGameStore();
  const [showContinue, setShowContinue] = useState(false);
  const [muted, setMuted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadSave();
    const hasSave = localStorage.getItem('shadowveil_save');
    setShowContinue(!!hasSave);
  }, [loadSave]);

  // Particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.8 - 0.2,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      ctx.fillStyle = '#1A1A24';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        ctx.fillStyle = `rgba(212, 168, 67, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Vignette
      const grad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.height * 0.3, canvas.width / 2, canvas.height / 2, canvas.height * 0.8);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-[#D4A843] tracking-wider" style={{ textShadow: '0 0 40px rgba(212,168,67,0.4), 0 4px 8px rgba(0,0,0,0.8)' }}>
            SHADOW VEIL
          </h1>
          <p className="text-lg md:text-xl text-[#8D99AE] mt-2 tracking-[0.3em] uppercase" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            Awakening
          </p>
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {showContinue && (
            <button onClick={() => navigate('/levels')} className="group flex items-center justify-center gap-3 py-3.5 bg-[#4CC9F0]/20 border border-[#4CC9F0]/40 rounded-xl text-[#4CC9F0] font-bold text-lg hover:bg-[#4CC9F0]/30 transition-all hover:scale-105">
              <LogIn className="w-5 h-5" /> Continue
            </button>
          )}
          <button onClick={() => navigate('/levels')} className="group flex items-center justify-center gap-3 py-3.5 bg-[#D4A843] rounded-xl text-[#1A1A24] font-bold text-lg hover:bg-[#e5b94c] transition-all hover:scale-105 shadow-lg shadow-[#D4A843]/20">
            <Play className="w-5 h-5" /> Play
          </button>
          <button onClick={() => navigate('/dashboard')} className="group flex items-center justify-center gap-3 py-3 bg-[#2D2D3A]/80 border border-[#8D99AE]/20 rounded-xl text-[#F8F9FA] font-semibold hover:bg-[#3D3D4A] transition-all hover:scale-105">
            <User className="w-5 h-5 text-[#4CC9F0]" /> Dashboard
          </button>
          <button onClick={() => navigate('/challenges')} className="group flex items-center justify-center gap-3 py-3 bg-[#2D2D3A]/80 border border-[#8D99AE]/20 rounded-xl text-[#F8F9FA] font-semibold hover:bg-[#3D3D4A] transition-all hover:scale-105">
            <Trophy className="w-5 h-5 text-[#D4A843]" /> Challenges
          </button>
          <button onClick={() => navigate('/dailyreward')} className="group flex items-center justify-center gap-3 py-3 bg-[#2D2D3A]/80 border border-[#8D99AE]/20 rounded-xl text-[#F8F9FA] font-semibold hover:bg-[#3D3D4A] transition-all hover:scale-105">
            <Gift className="w-5 h-5 text-[#E63946]" /> Daily Reward
          </button>
          <div className="flex gap-3 mt-1">
            <button onClick={() => navigate('/options')} className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2D2D3A]/60 border border-[#8D99AE]/20 rounded-xl text-[#8D99AE] hover:bg-[#3D3D4A] transition-all hover:text-[#F8F9FA]">
              <Settings className="w-4 h-4" /> Settings
            </button>
            <button onClick={() => navigate('/tutorial')} className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2D2D3A]/60 border border-[#8D99AE]/20 rounded-xl text-[#8D99AE] hover:bg-[#3D3D4A] transition-all hover:text-[#F8F9FA]">
              <BookOpen className="w-4 h-4" /> Tutorial
            </button>
            <button onClick={() => setMuted(!muted)} className="flex items-center justify-center p-3 bg-[#2D2D3A]/60 border border-[#8D99AE]/20 rounded-xl text-[#8D99AE] hover:bg-[#3D3D4A] transition-all hover:text-[#F8F9FA]">
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Stats bar */}
        {saveData.stats.levelsCompleted > 0 && (
          <div className="mt-6 flex items-center gap-4 text-xs text-[#8D99AE]">
            <span>Levels: {saveData.stats.levelsCompleted}/10</span>
            <span>Coins: {saveData.player.coins}</span>
            <span>Gems: {saveData.player.gems}</span>
          </div>
        )}

        {/* Version */}
        <div className="absolute bottom-4 text-[10px] text-[#8D99AE]/40">v1.0.0</div>
      </div>
    </div>
  );
}

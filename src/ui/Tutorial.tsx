import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoveHorizontal, ChevronUp, Crosshair, Zap, Star, Heart, Coins, Shield } from 'lucide-react';

export default function Tutorial() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1A1A24] text-[#F8F9FA]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#8D99AE] hover:text-[#F8F9FA] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <h1 className="text-3xl font-bold text-[#D4A843] mb-6">How to Play</h1>

        <div className="space-y-4">
          <TutorialSection icon={<MoveHorizontal className="w-6 h-6 text-[#4CC9F0]" />} title="Movement" color="#4CC9F0">
            <p className="text-sm text-[#8D99AE]"><kbd className="bg-[#1A1A24] px-1.5 py-0.5 rounded text-[#F8F9FA] font-mono text-xs">A</kbd> / <kbd className="bg-[#1A1A24] px-1.5 py-0.5 rounded text-[#F8F9FA] font-mono text-xs">D</kbd> or Arrow Keys to move. Hold <kbd className="bg-[#1A1A24] px-1.5 py-0.5 rounded text-[#F8F9FA] font-mono text-xs">Shift</kbd> to run.</p>
          </TutorialSection>
          <TutorialSection icon={<ChevronUp className="w-6 h-6 text-[#D4A843]" />} title="Jumping" color="#D4A843">
            <p className="text-sm text-[#8D99AE]"><kbd className="bg-[#1A1A24] px-1.5 py-0.5 rounded text-[#F8F9FA] font-mono text-xs">Space</kbd> or <kbd className="bg-[#1A1A24] px-1.5 py-0.5 rounded text-[#F8F9FA] font-mono text-xs">W</kbd> to jump. Press against walls to wall-slide and jump again.</p>
          </TutorialSection>
          <TutorialSection icon={<Crosshair className="w-6 h-6 text-[#E63946]" />} title="Combat" color="#E63946">
            <p className="text-sm text-[#8D99AE]"><kbd className="bg-[#1A1A24] px-1.5 py-0.5 rounded text-[#F8F9FA] font-mono text-xs">X</kbd> or <kbd className="bg-[#1A1A24] px-1.5 py-0.5 rounded text-[#F8F9FA] font-mono text-xs">J</kbd> to attack. Chain hits for combos. Attack enemies from behind to bypass shields.</p>
          </TutorialSection>
          <TutorialSection icon={<Zap className="w-6 h-6 text-[#9b59b6]" />} title="Dash" color="#9b59b6">
            <p className="text-sm text-[#8D99AE]"><kbd className="bg-[#1A1A24] px-1.5 py-0.5 rounded text-[#F8F9FA] font-mono text-xs">C</kbd> or <kbd className="bg-[#1A1A24] px-1.5 py-0.5 rounded text-[#F8F9FA] font-mono text-xs">K</kbd> to dash. Grants invincibility frames. Dash through secret walls to reveal hidden areas.</p>
          </TutorialSection>
          <TutorialSection icon={<Heart className="w-6 h-6 text-[#E63946]" />} title="Health & Energy" color="#E63946">
            <p className="text-sm text-[#8D99AE]">Red bar is HP. Blue bar is Energy for dashing. Collect potions to restore. Checkpoints save your progress.</p>
          </TutorialSection>
          <TutorialSection icon={<Coins className="w-6 h-6 text-[#D4A843]" />} title="Collectibles" color="#D4A843">
            <p className="text-sm text-[#8D99AE]">Gold coins add score. Blue gems are rare currency. Walk near items to magnetize them. Break crates for bonus loot.</p>
          </TutorialSection>
          <TutorialSection icon={<Star className="w-6 h-6 text-[#FF4800]" />} title="Star Rating" color="#FF4800">
            <p className="text-sm text-[#8D99AE]">1 Star: Complete level. 2 Stars: Under target time. 3 Stars: Under target time + no damage taken.</p>
          </TutorialSection>
          <TutorialSection icon={<Shield className="w-6 h-6 text-[#8D99AE]" />} title="Tips" color="#8D99AE">
            <ul className="text-sm text-[#8D99AE] space-y-1">
              <li>Stay airborne to avoid ground enemies</li>
              <li>Dash through projectiles with proper timing</li>
              <li>Ice floors are slippery - plan your jumps</li>
              <li>Bounce pads launch you to secret areas</li>
              <li>Bosses have attack patterns - watch and learn</li>
            </ul>
          </TutorialSection>
        </div>

        <button onClick={() => navigate('/levels')} className="w-full mt-6 py-4 bg-[#D4A843] text-[#1A1A24] rounded-xl font-bold text-lg hover:bg-[#e5b94c] transition-all hover:scale-105">
          Start Playing
        </button>
      </div>
    </div>
  );
}

function TutorialSection({ icon, title, color, children }: { icon: React.ReactNode; title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#2D2D3A] rounded-xl p-4 border border-[#8D99AE]/20">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '15' }}>{icon}</div>
        <h3 className="font-bold" style={{ color }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

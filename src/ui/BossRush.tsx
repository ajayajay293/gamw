import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, Swords, Star, AlertTriangle } from 'lucide-react';

export default function BossRush() {
  const navigate = useNavigate();
  const { saveData } = useGameStore();
  const unlocked = saveData.levels[9]?.completed;

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#1A1A24] text-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-[#8D99AE] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#8D99AE]">Locked</h1>
          <p className="text-[#8D99AE]/60 mt-2">Defeat the Gatekeeper in Level 9 to unlock</p>
          <button onClick={() => navigate('/levels')} className="mt-6 px-6 py-3 bg-[#D4A843] text-[#1A1A24] rounded-xl font-bold hover:bg-[#e5b94c]">Go to Levels</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A24] text-[#F8F9FA]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#8D99AE] hover:text-[#F8F9FA] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <div className="text-center mb-8">
          <Swords className="w-12 h-12 text-[#FF4800] mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-[#FF4800]">Boss Rush</h1>
          <p className="text-[#8D99AE] text-sm mt-2">Defeat all bosses in sequence without healing between fights</p>
        </div>

        <div className="bg-[#2D2D3A] rounded-xl p-4 border border-[#FF4800]/20 mb-6">
          <div className="flex items-center gap-3 text-[#FF4800]">
            <AlertTriangle className="w-5 h-5" />
            <p className="text-sm">Health does not regenerate between waves. Good luck, warrior.</p>
          </div>
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((wave) => (
            <div key={wave} className="flex items-center gap-4 p-4 bg-[#2D2D3A] rounded-xl border border-[#8D99AE]/20">
              <div className="w-10 h-10 rounded-full bg-[#FF4800]/10 flex items-center justify-center text-[#FF4800] font-bold">{wave}</div>
              <div className="flex-1">
                <div className="font-bold text-sm">Wave {wave}</div>
                <div className="text-xs text-[#8D99AE]">{wave === 5 ? 'Gatekeeper (Full Power)' : `${wave * 2} Enemies + Mini-boss`}</div>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#D4A843]">
                <Star className="w-3 h-3" /> {wave * 50}
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/game/9')} className="w-full mt-6 py-4 bg-[#FF4800] text-white rounded-xl font-bold text-lg hover:bg-[#ff5a1f] transition-all hover:scale-105">
          Start Boss Rush
        </button>
      </div>
    </div>
  );
}

function Lock(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
}

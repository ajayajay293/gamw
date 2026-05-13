import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, Package, Heart, Zap, Shield, Sword } from 'lucide-react';

export default function Inventory() {
  const navigate = useNavigate();
  const { saveData } = useGameStore();

  return (
    <div className="min-h-screen bg-[#1A1A24] text-[#F8F9FA]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#8D99AE] hover:text-[#F8F9FA] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <h1 className="text-3xl font-bold text-[#D4A843] mb-6 flex items-center gap-3">
          <Package className="w-8 h-8" /> Inventory
        </h1>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {saveData.inventory.map((item) => (
            <div key={item.id} className="bg-[#2D2D3A] rounded-xl p-3 border border-[#8D99AE]/20 flex flex-col items-center text-center hover:border-[#D4A843]/30 transition-all">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-1 ${
                item.type === 'consumable' ? 'bg-[#E63946]/10 text-[#E63946]' :
                item.type === 'equipment' ? 'bg-[#4CC9F0]/10 text-[#4CC9F0]' :
                'bg-[#D4A843]/10 text-[#D4A843]'
              }`}>
                {item.icon === 'heart' ? <Heart className="w-5 h-5" /> :
                 item.icon === 'zap' ? <Zap className="w-5 h-5" /> :
                 item.icon === 'shield' ? <Shield className="w-5 h-5" /> :
                 <Sword className="w-5 h-5" />}
              </div>
              <span className="text-[10px] font-bold truncate w-full">{item.name}</span>
              <span className="text-[10px] text-[#8D99AE]">x{item.quantity}</span>
              <span className={`text-[8px] mt-0.5 px-1.5 py-0.5 rounded-full ${
                item.rarity === 'common' ? 'bg-[#8D99AE]/10 text-[#8D99AE]' :
                item.rarity === 'uncommon' ? 'bg-[#4CC9F0]/10 text-[#4CC9F0]' :
                item.rarity === 'rare' ? 'bg-[#D4A843]/10 text-[#D4A843]' :
                'bg-[#E63946]/10 text-[#E63946]'
              }`}>{item.rarity}</span>
            </div>
          ))}
          {Array.from({ length: 16 - saveData.inventory.length }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-[#2D2D3A]/50 rounded-xl p-3 border border-dashed border-[#8D99AE]/10 flex items-center justify-center min-h-[90px]">
              <span className="text-[#8D99AE]/20 text-lg">+</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

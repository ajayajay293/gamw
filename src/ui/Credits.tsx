import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Code, Palette, Music, Gamepad2, Heart } from 'lucide-react';

export default function Credits() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1A1A24] text-[#F8F9FA]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#8D99AE] hover:text-[#F8F9FA] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <h1 className="text-3xl font-bold text-[#D4A843] mb-8 text-center">Credits</h1>

        <div className="space-y-6 text-center">
          <div>
            <Gamepad2 className="w-8 h-8 text-[#D4A843] mx-auto mb-2" />
            <h2 className="text-xl font-bold text-[#F8F9FA] mb-1">Shadow Veil: Awakening</h2>
            <p className="text-sm text-[#8D99AE]">An original HTML5 action-platformer</p>
          </div>

          <div className="border-t border-[#8D99AE]/20 pt-6">
            <Code className="w-6 h-6 text-[#4CC9F0] mx-auto mb-2" />
            <h3 className="font-bold text-[#4CC9F0]">Game Engine</h3>
            <p className="text-sm text-[#8D99AE]">Custom Canvas 2D Engine</p>
            <p className="text-sm text-[#8D99AE]">React + TypeScript + Vite</p>
          </div>

          <div className="border-t border-[#8D99AE]/20 pt-6">
            <Palette className="w-6 h-6 text-[#E63946] mx-auto mb-2" />
            <h3 className="font-bold text-[#E63946]">Art & Design</h3>
            <p className="text-sm text-[#8D99AE]">Dark Fantasy Aesthetic</p>
            <p className="text-sm text-[#8D99AE]">Original visual design</p>
          </div>

          <div className="border-t border-[#8D99AE]/20 pt-6">
            <Music className="w-6 h-6 text-[#9b59b6] mx-auto mb-2" />
            <h3 className="font-bold text-[#9b59b6]">Audio Design</h3>
            <p className="text-sm text-[#8D99AE]">Web Audio API</p>
          </div>

          <div className="border-t border-[#8D99AE]/20 pt-6">
            <Heart className="w-6 h-6 text-[#D4A843] mx-auto mb-2" />
            <h3 className="font-bold text-[#D4A843]">Special Thanks</h3>
            <p className="text-sm text-[#8D99AE]">To all players who dare to enter the Shadow Veil</p>
          </div>
        </div>

        <p className="text-center text-[#8D99AE]/40 text-xs mt-8">v1.0.0 Built with passion</p>
      </div>
    </div>
  );
}

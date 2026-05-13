import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, Download, Upload, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function SaveLoad() {
  const navigate = useNavigate();
  const { saveData, saveGame, loadSave, resetSave } = useGameStore();
  const [msg, setMsg] = useState('');
  const [showDelete, setShowDelete] = useState(false);

  const exportSave = () => {
    const data = JSON.stringify(saveData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shadowveil_save.json';
    a.click();
    URL.revokeObjectURL(url);
    setMsg('Save exported!');
    setTimeout(() => setMsg(''), 2000);
  };

  const importSave = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          localStorage.setItem('shadowveil_save', JSON.stringify(data));
          loadSave();
          setMsg('Save imported!');
          setTimeout(() => setMsg(''), 2000);
        } catch { setMsg('Invalid save file!'); setTimeout(() => setMsg(''), 2000); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-[#1A1A24] text-[#F8F9FA]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate('/options')} className="flex items-center gap-2 text-[#8D99AE] hover:text-[#F8F9FA] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <h1 className="text-3xl font-bold text-[#D4A843] mb-6">Save / Load</h1>

        {msg && <div className="mb-4 p-3 bg-[#4CC9F0]/10 border border-[#4CC9F0]/30 rounded-xl text-[#4CC9F0] text-sm font-semibold text-center">{msg}</div>}

        <div className="bg-[#2D2D3A] rounded-xl p-4 border border-[#8D99AE]/20 mb-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-[#8D99AE]">Level:</span> <span className="text-[#F8F9FA] font-mono">{saveData.player.level}</span></div>
            <div><span className="text-[#8D99AE]">Coins:</span> <span className="text-[#D4A843] font-mono">{saveData.player.coins}</span></div>
            <div><span className="text-[#8D99AE]">Gems:</span> <span className="text-[#4CC9F0] font-mono">{saveData.player.gems}</span></div>
            <div><span className="text-[#8D99AE]">Last:</span> <span className="text-[#F8F9FA] font-mono text-xs">{new Date(saveData.lastPlayed).toLocaleDateString()}</span></div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={() => { saveGame(); setMsg('Game saved!'); setTimeout(() => setMsg(''), 2000); }} className="flex items-center justify-center gap-3 py-3 bg-[#4CC9F0]/20 border border-[#4CC9F0]/30 rounded-xl text-[#4CC9F0] font-bold hover:bg-[#4CC9F0]/30 transition-colors">
            <Download className="w-5 h-5" /> Save Game
          </button>
          <button onClick={exportSave} className="flex items-center justify-center gap-3 py-3 bg-[#D4A843]/20 border border-[#D4A843]/30 rounded-xl text-[#D4A843] font-bold hover:bg-[#D4A843]/30 transition-colors">
            <Upload className="w-5 h-5" /> Export Save
          </button>
          <button onClick={importSave} className="flex items-center justify-center gap-3 py-3 bg-[#2D2D3A] border border-[#8D99AE]/20 rounded-xl text-[#F8F9FA] font-bold hover:bg-[#3D3D4A] transition-colors">
            <Download className="w-5 h-5" /> Import Save
          </button>
          <button onClick={() => setShowDelete(true)} className="flex items-center justify-center gap-3 py-3 bg-[#E63946]/10 border border-[#E63946]/20 rounded-xl text-[#E63946] font-bold hover:bg-[#E63946]/20 transition-colors mt-2">
            <Trash2 className="w-5 h-5" /> Delete Save
          </button>
        </div>

        {showDelete && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-[#2D2D3A] rounded-2xl p-6 border border-[#E63946]/30 max-w-sm w-full mx-4">
              <div className="flex items-center gap-3 text-[#E63946] mb-4"><AlertTriangle className="w-8 h-8" /><h2 className="text-xl font-bold">Delete Save?</h2></div>
              <p className="text-[#8D99AE] mb-6">All progress will be lost forever.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDelete(false)} className="flex-1 py-2.5 bg-[#8D99AE]/20 rounded-xl text-[#F8F9FA] hover:bg-[#8D99AE]/30">Cancel</button>
                <button onClick={() => { resetSave(); setShowDelete(false); setMsg('Save deleted!'); setTimeout(() => setMsg(''), 2000); }} className="flex-1 py-2.5 bg-[#E63946] rounded-xl text-white font-bold hover:bg-[#ff4d4d]">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

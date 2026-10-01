import React from 'react';
import { useGloveStore } from '../store/useGloveStore';
import { Radio, Music, Cpu, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  const { wsConnected, rh, lh, midi } = useGloveStore();

  return (
    <header className="h-16 bg-cyber-panel/90 backdrop-blur-md border-b border-cyber-border px-6 flex items-center justify-between z-20 shrink-0">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyber-cyan to-cyber-green flex items-center justify-center shadow-glowCyan">
          <Zap className="w-5 h-5 text-black font-extrabold" />
        </div>
        <div>
          <h1 className="text-sm font-black tracking-wider text-white flex items-center gap-2">
            SMART DRUM GLOVE
            <span className="text-[10px] font-mono font-bold bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/40 px-1.5 py-0.5 rounded">
              3D STUDIO
            </span>
          </h1>
          <p className="text-[10px] font-mono text-cyber-textMuted tracking-tight">
            ESP32 WEARABLE MIDI CONTROLLER // FASTAPI + THREE.JS
          </p>
        </div>
      </div>

      {/* Global Status Indicators */}
      <div className="flex items-center gap-3">
        {/* WebSocket Bridge */}
        <div className="flex items-center gap-2 bg-[#121418] border border-cyber-border rounded-xl px-3 py-1.5 text-xs font-mono">
          <Radio
            className={`w-3.5 h-3.5 ${
              wsConnected ? 'text-cyber-green animate-pulse' : 'text-cyber-red'
            }`}
          />
          <span className="text-cyber-textMuted text-[11px]">BRIDGE:</span>
          <span
            className={`font-bold text-[11px] ${
              wsConnected ? 'text-cyber-green' : 'text-cyber-red'
            }`}
          >
            {wsConnected ? 'LIVE WS' : 'OFFLINE'}
          </span>
        </div>

        {/* MIDI Engine */}
        <div className="flex items-center gap-2 bg-[#121418] border border-cyber-border rounded-xl px-3 py-1.5 text-xs font-mono">
          <Music
            className={`w-3.5 h-3.5 ${
              midi.connected ? 'text-cyber-cyan' : 'text-cyber-textMuted'
            }`}
          />
          <span className="text-cyber-textMuted text-[11px]">MIDI:</span>
          <span
            className={`font-bold text-[11px] ${
              midi.connected ? 'text-cyber-cyan' : 'text-cyber-textMuted'
            }`}
          >
            {midi.connected ? (midi.name.length > 12 ? midi.name.slice(0, 10) + '..' : midi.name) : 'NONE'}
          </span>
        </div>

        {/* RH Glove */}
        <div className="flex items-center gap-2 bg-[#121418] border border-cyber-border rounded-xl px-3 py-1.5 text-xs font-mono">
          <Cpu
            className={`w-3.5 h-3.5 ${
              rh.connected ? 'text-cyber-cyan animate-pulse' : 'text-cyber-textMuted'
            }`}
          />
          <span className="text-cyber-textMuted text-[11px]">RH:</span>
          <span
            className={`font-bold text-[11px] ${
              rh.connected ? 'text-cyber-cyan' : 'text-cyber-textMuted'
            }`}
          >
            {rh.connected ? 'ACTIVE' : 'IDLE'}
          </span>
        </div>

        {/* LH Glove */}
        <div className="flex items-center gap-2 bg-[#121418] border border-cyber-border rounded-xl px-3 py-1.5 text-xs font-mono">
          <Cpu
            className={`w-3.5 h-3.5 ${
              lh.connected ? 'text-cyber-green animate-pulse' : 'text-cyber-textMuted'
            }`}
          />
          <span className="text-cyber-textMuted text-[11px]">LH:</span>
          <span
            className={`font-bold text-[11px] ${
              lh.connected ? 'text-cyber-green' : 'text-cyber-textMuted'
            }`}
          >
            {lh.connected ? 'ACTIVE' : 'IDLE'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;

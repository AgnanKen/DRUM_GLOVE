import React from 'react';
import { useGloveStore } from '../store/useGloveStore';
import Hand3D from './Hand3D';
import { Radio, Eye, Sparkles } from 'lucide-react';

export const CenterColumn: React.FC = () => {
  const { activeSide, setActiveSide, isHandFlashing, lastHit, rh, lh } = useGloveStore();

  const currentGlove = activeSide === 'rh' ? rh : lh;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* ---------------- 3D HAND TOP BAR & HIT PULSE ---------------- */}
      <div className="bg-cyber-panel border border-cyber-border rounded-2xl p-4 shadow-lg flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyber-cyan" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyber-cyan font-mono">
              REAL-TIME 3D SPATIAL HAND
            </h2>
          </div>

          {/* Hand view toggle */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyber-textMuted mr-1">VIEW:</span>
            <div className="flex bg-[#121418] p-1 rounded-xl border border-cyber-border">
              <button
                onClick={() => setActiveSide('rh')}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                  activeSide === 'rh'
                    ? 'bg-cyber-cyan text-black shadow-glowCyan'
                    : 'text-cyber-textMuted hover:text-white'
                }`}
              >
                RIGHT HAND (RH)
              </button>
              <button
                onClick={() => setActiveSide('lh')}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                  activeSide === 'lh'
                    ? 'bg-cyber-green text-black shadow-glowGreen'
                    : 'text-cyber-textMuted hover:text-white'
                }`}
              >
                LEFT HAND (LH)
              </button>
            </div>
          </div>
        </div>

        {/* Live Drum Hit Pulse Banner */}
        <div
          className={`w-full py-2.5 px-4 rounded-xl border transition-all duration-150 flex items-center justify-between ${
            isHandFlashing
              ? 'bg-cyber-amber/25 border-cyber-amber shadow-glowAmber scale-[1.01]'
              : 'bg-[#15171c] border-cyber-border'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Sparkles
              className={`w-4 h-4 transition-colors ${
                isHandFlashing ? 'text-cyber-amber animate-spin' : 'text-cyber-textMuted'
              }`}
            />
            <div className="flex items-center gap-2 font-mono">
              <span className="text-xs text-cyber-textMuted">LAST HIT:</span>
              <span
                className={`text-sm font-extrabold uppercase tracking-wide ${
                  isHandFlashing ? 'text-cyber-amber' : 'text-cyber-textBright'
                }`}
              >
                {lastHit ? lastHit.name : 'NO RECENT HIT'}
              </span>
            </div>
          </div>

          {lastHit && (
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-cyber-cyan">NOTE: {lastHit.note}</span>
              <span className="text-cyber-green">VEL: {lastHit.velocity}</span>
              <span className="text-cyber-amber uppercase">[{lastHit.side}]</span>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- 3D CANVAS VIEWPORT ---------------- */}
      <div className="relative flex-1 min-h-[460px] w-full">
        <Hand3D side={activeSide} />

        {/* Floating Telemetry HUD */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
          <div className="flex items-center gap-2 bg-[#15171c]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyber-border text-xs font-mono">
            <Radio
              className={`w-3.5 h-3.5 ${
                currentGlove.connected ? 'text-cyber-green animate-pulse' : 'text-cyber-red'
              }`}
            />
            <span className="text-cyber-textMuted">FLEX STREAM:</span>
            <span className="text-cyber-cyan font-bold">
              F1:{currentGlove.f1} F2:{currentGlove.f2} F3:{currentGlove.f3} F4:{currentGlove.f4}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#15171c]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyber-border text-xs font-mono">
            <span className="text-cyber-textMuted">IMU FUSION:</span>
            <span className="text-cyber-green font-bold">
              {currentGlove.movement > 5.0 ? 'DYNAMIC MOTION' : 'STEADY'} (Mv: {currentGlove.movement.toFixed(1)})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterColumn;

import React, { useState, useRef, useEffect } from 'react';
import { useGloveStore } from '../store/useGloveStore';
import {
  Music,
  RotateCw,
  Sliders,
  Terminal,
  Trash2,
  Volume2,
} from 'lucide-react';

const DRUM_PADS = [
  { key: 'kick', label: 'KICK', note: 36 },
  { key: 'snare', label: 'SNARE', note: 38 },
  { key: 'closed_hihat', label: 'HI-HAT', note: 42 },
  { key: 'open_hihat', label: 'OPEN HH', note: 46 },
  { key: 'low_tom', label: 'LOW TOM', note: 45 },
  { key: 'mid_tom', label: 'MID TOM', note: 47 },
  { key: 'high_tom', label: 'HIGH TOM', note: 50 },
  { key: 'crash', label: 'CRASH', note: 49 },
  { key: 'ride', label: 'RIDE', note: 51 },
  { key: 'ride_bell', label: 'RIDE BELL', note: 53 },
  { key: 'china', label: 'CHINA', note: 52 },
  { key: 'splash', label: 'SPLASH', note: 55 },
  { key: 'cowbell', label: 'COWBELL', note: 56 },
  { key: 'clap', label: 'CLAP', note: 39 },
];

export const RightColumn: React.FC = () => {
  const {
    ports,
    midi,
    settings,
    activePads,
    logs,
    triggerTestNote,
    openMidi,
    listPorts,
    updateSetting,
    clearLogs,
  } = useGloveStore();

  const [selectedMidi, setSelectedMidi] = useState<string>('');
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleOpenMidi = () => {
    const portToOpen = selectedMidi || (ports.midi.length > 0 ? ports.midi[0] : '');
    if (portToOpen) {
      openMidi(portToOpen);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto pl-1">
      {/* ---------------- 14-BUTTON DRUM PAD GRID ---------------- */}
      <div className="bg-cyber-panel border border-cyber-border rounded-2xl p-4 shadow-lg flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-mono text-cyber-cyan flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5" /> DRUM PADS (14)
          </span>
          <span className="text-[10px] font-mono text-cyber-textMuted">Click to test note</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {DRUM_PADS.map((pad) => {
            const isFired = !!activePads[pad.note];
            return (
              <button
                key={pad.key}
                onClick={() => triggerTestNote(pad.note)}
                className={`py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-0.5 font-mono transition-all duration-75 select-none ${
                  isFired
                    ? 'bg-cyber-amber text-black scale-[0.97] shadow-glowAmber border border-white font-extrabold'
                    : 'bg-[#15171c] hover:bg-[#252834] text-cyber-textBright border border-cyber-border hover:border-cyber-cyan/50 font-bold'
                }`}
              >
                <span className="text-xs leading-none">{pad.label}</span>
                <span
                  className={`text-[10px] ${
                    isFired ? 'text-black/80 font-bold' : 'text-cyber-textMuted'
                  }`}
                >
                  #{pad.note}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------- MIDI OUTPUT ---------------- */}
      <div className="bg-cyber-panel border border-cyber-border rounded-2xl p-4 shadow-lg flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-mono text-cyber-cyan flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5" /> MIDI ENGINE OUTPUT
          </span>
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
              midi.connected ? 'bg-cyber-green/20 text-cyber-green' : 'bg-cyber-red/20 text-cyber-red'
            }`}
          >
            {midi.connected ? 'CONNECTED' : 'DISCONNECTED'}
          </span>
        </div>

        <div className="flex gap-2 items-center">
          <select
            value={selectedMidi || (ports.midi[0] ?? '')}
            onChange={(e) => setSelectedMidi(e.target.value)}
            className="flex-1 bg-[#15171c] text-xs font-mono text-cyber-textBright px-3 py-2 rounded-xl border border-cyber-border focus:border-cyber-cyan focus:outline-none"
          >
            {ports.midi.length === 0 ? (
              <option value="">No MIDI ports detected</option>
            ) : (
              ports.midi.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))
            )}
          </select>

          <button
            onClick={() => listPorts()}
            title="Refresh MIDI Ports"
            className="p-2 rounded-xl bg-[#15171c] hover:bg-[#252834] border border-cyber-border text-cyber-textMuted hover:text-cyber-cyan transition-all"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleOpenMidi}
            className="px-3 py-2 rounded-xl bg-cyber-cyan hover:bg-cyber-cyan/90 text-black text-xs font-bold font-mono transition-all"
          >
            Open
          </button>
        </div>
      </div>

      {/* ---------------- SETTINGS SLIDERS ---------------- */}
      <div className="bg-cyber-panel border border-cyber-border rounded-2xl p-4 shadow-lg flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-mono text-cyber-cyan flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" /> ENGINE SETTINGS
          </span>
          <span className="text-[10px] font-mono text-cyber-textMuted">Live sync</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Flex 1..4 Thresholds */}
          {(['flex1_threshold', 'flex2_threshold', 'flex3_threshold', 'flex4_threshold'] as const).map(
            (key, idx) => (
              <div key={key} className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-cyber-textMuted">Flex {idx + 1} Threshold:</span>
                  <span className="text-cyber-cyan font-bold tabular-nums">{settings[key]}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="500"
                  value={settings[key]}
                  onChange={(e) => updateSetting(key, Number(e.target.value))}
                  className="w-full accent-cyber-cyan cursor-pointer bg-[#121418] h-1.5 rounded-lg"
                />
              </div>
            )
          )}

          {/* Movement Threshold */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-cyber-textMuted">Movement Threshold:</span>
              <span className="text-cyber-green font-bold tabular-nums">
                {settings.movement_threshold.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="0.5"
              value={settings.movement_threshold}
              onChange={(e) => updateSetting('movement_threshold', Number(e.target.value))}
              className="w-full accent-cyber-green cursor-pointer bg-[#121418] h-1.5 rounded-lg"
            />
          </div>

          {/* Smoothing */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-cyber-textMuted">Smoothing (Alpha):</span>
              <span className="text-cyber-cyan font-bold tabular-nums">
                {settings.smoothing.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="0.9"
              step="0.05"
              value={settings.smoothing}
              onChange={(e) => updateSetting('smoothing', Number(e.target.value))}
              className="w-full accent-cyber-cyan cursor-pointer bg-[#121418] h-1.5 rounded-lg"
            />
          </div>

          {/* Velocity Sensitivity */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-cyber-textMuted">Velocity Sensitivity:</span>
              <span className="text-cyber-amber font-bold tabular-nums">
                {settings.velocity_sensitivity.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10.0"
              step="0.5"
              value={settings.velocity_sensitivity}
              onChange={(e) => updateSetting('velocity_sensitivity', Number(e.target.value))}
              className="w-full accent-cyber-amber cursor-pointer bg-[#121418] h-1.5 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* ---------------- ACTIVITY LOG (LAST 200 LINES) ---------------- */}
      <div className="bg-cyber-panel border border-cyber-border rounded-2xl p-4 shadow-lg flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-mono text-cyber-textBright flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyber-cyan" /> ACTIVITY LOG
          </span>
          <button
            onClick={clearLogs}
            title="Clear Log"
            className="flex items-center gap-1 text-[11px] font-mono text-cyber-textMuted hover:text-cyber-red transition-all"
          >
            <Trash2 className="w-3 h-3" /> Clear
          </button>
        </div>

        <div
          ref={logContainerRef}
          className="h-36 overflow-y-auto bg-[#0f1114] border border-cyber-border/80 rounded-xl p-2.5 font-mono text-[11px] flex flex-col-reverse gap-1 text-cyber-textMuted selection:bg-cyber-cyan/30"
        >
          {logs.length === 0 ? (
            <div className="text-cyber-textMuted/50 italic py-2 text-center">
              No activity logged yet...
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="leading-snug break-all text-cyber-textBright/90">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RightColumn;

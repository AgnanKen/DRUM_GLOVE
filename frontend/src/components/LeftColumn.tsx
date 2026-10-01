import React, { useState } from 'react';
import { useGloveStore } from '../store/useGloveStore';
import {
  Wifi,
  Usb,
  RotateCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Activity,
  Compass,
  Zap,
} from 'lucide-react';

export const LeftColumn: React.FC = () => {
  const {
    activeSide,
    setActiveSide,
    rh,
    lh,
    settings,
    ports,
    connectGlove,
    disconnectGlove,
    calibrate,
    suggestThresholds,
    listPorts,
  } = useGloveStore();

  const [mode, setMode] = useState<'USB Serial' | 'Wireless UDP'>('USB Serial');
  const [selectedPort, setSelectedPort] = useState<string>('');
  const [udpPort, setUdpPort] = useState<number>(activeSide === 'rh' ? 5005 : 5006);

  const currentGlove = activeSide === 'rh' ? rh : lh;

  const handleConnect = () => {
    if (mode === 'USB Serial') {
      const portToUse = selectedPort || (ports.serial.length > 0 ? ports.serial[0] : '');
      if (portToUse) {
        connectGlove(activeSide, 'USB Serial', portToUse);
      }
    } else {
      connectGlove(activeSide, 'Wireless UDP', udpPort);
    }
  };

  const handleDisconnect = () => {
    disconnectGlove(activeSide);
  };

  const fingerNames = ['F1 (Index)', 'F2 (Middle)', 'F3 (Ring)', 'F4 (Pinky)'];
  const flexKeys = ['f1', 'f2', 'f3', 'f4'] as const;

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1">
      {/* ---------------- GLOVE SIDE SELECTOR & STATUS ---------------- */}
      <div className="bg-cyber-panel border border-cyber-border rounded-2xl p-4 shadow-lg flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-cyan shadow-glowCyan animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyber-cyan font-mono">
              GLOVE TELEMETRY
            </h2>
          </div>
          <div className="flex bg-[#121418] p-1 rounded-xl border border-cyber-border">
            <button
              onClick={() => {
                setActiveSide('rh');
                setUdpPort(5005);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeSide === 'rh'
                  ? 'bg-cyber-cyan text-black shadow-glowCyan'
                  : 'text-cyber-textMuted hover:text-white'
              }`}
            >
              RH (Right)
            </button>
            <button
              onClick={() => {
                setActiveSide('lh');
                setUdpPort(5006);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeSide === 'lh'
                  ? 'bg-cyber-green text-black shadow-glowGreen'
                  : 'text-cyber-textMuted hover:text-white'
              }`}
            >
              LH (Left)
            </button>
          </div>
        </div>

        {/* Connection Controls */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            onClick={() => setMode('USB Serial')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all ${
              mode === 'USB Serial'
                ? 'bg-cyber-borderLight/30 border-cyber-cyan text-cyber-cyan'
                : 'bg-[#15171c] border-cyber-border text-cyber-textMuted hover:border-cyber-borderLight'
            }`}
          >
            <Usb className="w-3.5 h-3.5" /> USB Serial
          </button>
          <button
            onClick={() => setMode('Wireless UDP')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all ${
              mode === 'Wireless UDP'
                ? 'bg-cyber-borderLight/30 border-cyber-green text-cyber-green'
                : 'bg-[#15171c] border-cyber-border text-cyber-textMuted hover:border-cyber-borderLight'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" /> Wireless UDP
          </button>
        </div>

        {/* Port Row */}
        <div className="flex gap-2 items-center">
          {mode === 'USB Serial' ? (
            <select
              value={selectedPort || (ports.serial[0] ?? '')}
              onChange={(e) => setSelectedPort(e.target.value)}
              className="flex-1 bg-[#15171c] text-xs font-mono text-cyber-textBright px-3 py-2 rounded-xl border border-cyber-border focus:border-cyber-cyan focus:outline-none"
            >
              {ports.serial.length === 0 ? (
                <option value="">No serial ports found</option>
              ) : (
                ports.serial.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))
              )}
            </select>
          ) : (
            <div className="flex-1 flex items-center bg-[#15171c] border border-cyber-border rounded-xl px-3 py-1.5">
              <span className="text-[11px] font-mono text-cyber-textMuted mr-2">UDP PORT:</span>
              <input
                type="number"
                value={udpPort}
                onChange={(e) => setUdpPort(Number(e.target.value))}
                className="w-full bg-transparent text-xs font-mono text-cyber-textBright focus:outline-none"
              />
            </div>
          )}

          <button
            onClick={() => listPorts()}
            title="Refresh Ports"
            className="p-2 rounded-xl bg-[#15171c] hover:bg-[#252834] border border-cyber-border text-cyber-textMuted hover:text-cyber-cyan transition-all"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Action Button & Status Chip */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            {currentGlove.connected ? (
              <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyber-green bg-cyber-green/10 border border-cyber-green/30 px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5" /> CONNECTED
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyber-red bg-cyber-red/10 border border-cyber-red/30 px-2.5 py-1 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5" /> DISCONNECTED
              </span>
            )}
          </div>

          {currentGlove.connected ? (
            <button
              onClick={handleDisconnect}
              className="px-4 py-1.5 rounded-xl bg-cyber-red/20 hover:bg-cyber-red/30 border border-cyber-red/50 text-cyber-red text-xs font-bold transition-all"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={handleConnect}
              className="px-4 py-1.5 rounded-xl bg-cyber-cyan hover:bg-cyber-cyan/90 text-black text-xs font-bold shadow-glowCyan transition-all"
            >
              Connect
            </button>
          )}
        </div>
      </div>

      {/* ---------------- RAW FLEX SENSORS (0 - 4095) ---------------- */}
      <div className="bg-cyber-panel border border-cyber-border rounded-2xl p-4 shadow-lg flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-mono text-cyber-cyan flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> RAW FLEX (0 - 4095)
          </span>
          <span className="text-[10px] font-mono text-cyber-textMuted">ESP32 ADC</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {flexKeys.map((key, idx) => {
            const rawVal = currentGlove[key];
            const pct = Math.min(100, Math.max(0, (rawVal / 4095) * 100));
            return (
              <div key={key} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyber-textMuted font-medium">{fingerNames[idx]}</span>
                  <span className="text-cyber-cyan font-bold tabular-nums">{rawVal}</span>
                </div>
                <div className="w-full bg-[#121418] h-2.5 rounded-full overflow-hidden border border-cyber-border/70 p-[1px]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-green transition-all duration-75"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- LIVE BEND SENSORS & THRESHOLD ---------------- */}
      <div className="bg-cyber-panel border border-cyber-border rounded-2xl p-4 shadow-lg flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-mono text-cyber-green flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> LIVE BEND (DELTA)
          </span>
          <span className="text-[10px] font-mono text-cyber-textMuted">vs Threshold</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {flexKeys.map((key, idx) => {
            const bendVal = currentGlove.bend[key];
            const thrKey = `flex${idx + 1}_threshold` as keyof typeof settings;
            const threshold = settings[thrKey] as number;
            const isFired = bendVal > threshold;
            const pct = Math.min(100, Math.max(0, (bendVal / 500) * 100));

            return (
              <div key={key} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyber-textMuted font-medium">{fingerNames[idx]}</span>
                  <div className="flex items-center gap-2">
                    {isFired && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyber-amber text-black font-extrabold animate-pulse">
                        FIRE
                      </span>
                    )}
                    <span className="text-cyber-green font-bold tabular-nums">
                      {bendVal} <span className="text-cyber-textMuted font-normal text-[10px]">/ {threshold}</span>
                    </span>
                  </div>
                </div>
                <div className="relative w-full bg-[#121418] h-2.5 rounded-full overflow-hidden border border-cyber-border/70 p-[1px]">
                  <div
                    className={`h-full rounded-full transition-all duration-75 ${
                      isFired ? 'bg-cyber-amber shadow-glowAmber' : 'bg-gradient-to-r from-cyber-green to-cyber-cyan'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                  {/* Threshold marker */}
                  <div
                    className="absolute top-0 bottom-0 w-[2px] bg-cyber-amber z-10 opacity-75"
                    style={{ left: `${Math.min(100, (threshold / 500) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- IMU READOUT & MOVEMENT ---------------- */}
      <div className="bg-cyber-panel border border-cyber-border rounded-2xl p-4 shadow-lg flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-mono text-cyber-cyan flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" /> MPU6050 MOTION TELEMETRY
          </span>
        </div>

        {/* Monospace IMU Readout */}
        <div className="bg-[#121418] border border-cyber-border rounded-xl p-3 font-mono text-xs flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-cyber-cyan">
            <span className="text-cyber-textMuted">ACC (g):</span>
            <span className="tabular-nums">
              {currentGlove.ax.toFixed(2)} {currentGlove.ay.toFixed(2)} {currentGlove.az.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center text-cyber-green">
            <span className="text-cyber-textMuted">GYR (°/s):</span>
            <span className="tabular-nums">
              {currentGlove.gx.toFixed(1)} {currentGlove.gy.toFixed(1)} {currentGlove.gz.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Movement Indicator with threshold */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-cyber-textMuted">Movement Intensity:</span>
            <span className="text-[#f6c] font-bold tabular-nums">
              {currentGlove.movement.toFixed(1)}{' '}
              <span className="text-cyber-textMuted text-[10px] font-normal">
                (Thr: {settings.movement_threshold})
              </span>
            </span>
          </div>
          <div className="w-full bg-[#121418] h-2.5 rounded-full overflow-hidden border border-cyber-border/70 p-[1px]">
            <div
              className={`h-full rounded-full transition-all duration-75 ${
                currentGlove.movement > settings.movement_threshold
                  ? 'bg-gradient-to-r from-[#ff6b9d] to-cyber-amber shadow-glowAmber'
                  : 'bg-gradient-to-r from-cyber-cyan to-[#c792ea]'
              }`}
              style={{
                width: `${Math.min(100, (currentGlove.movement / Math.max(50, settings.movement_threshold * 2)) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* ---------------- CALIBRATION PANEL ---------------- */}
      <div className="bg-cyber-panel border border-cyber-border rounded-2xl p-4 shadow-lg flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-mono text-cyber-amber flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" /> SENSOR CALIBRATION
          </span>
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
              currentGlove.calibDone
                ? 'bg-cyber-green/20 text-cyber-green'
                : currentGlove.isCalibrating
                ? 'bg-cyber-amber/20 text-cyber-amber animate-pulse'
                : 'bg-cyber-border/50 text-cyber-textMuted'
            }`}
          >
            {currentGlove.isCalibrating
              ? `CALIBRATING (${currentGlove.calibPct}%)`
              : currentGlove.calibDone
              ? 'CALIBRATED'
              : 'NOT CALIBRATED'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#121418] h-2.5 rounded-full overflow-hidden border border-cyber-border/70 p-[1px]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyber-amber to-cyber-green transition-all duration-150"
            style={{ width: `${currentGlove.calibPct}%` }}
          />
        </div>

        {/* Calibration & Suggest Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            onClick={() => calibrate(activeSide)}
            disabled={!currentGlove.connected || currentGlove.isCalibrating}
            className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
              !currentGlove.connected || currentGlove.isCalibrating
                ? 'bg-[#15171c] text-cyber-textMuted/40 border border-cyber-border cursor-not-allowed'
                : 'bg-cyber-amber/20 hover:bg-cyber-amber/30 text-cyber-amber border border-cyber-amber/50 shadow-glowAmber'
            }`}
          >
            CALIBRATE
          </button>
          <button
            onClick={() => suggestThresholds(activeSide)}
            disabled={!currentGlove.calibDone}
            className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
              !currentGlove.calibDone
                ? 'bg-[#15171c] text-cyber-textMuted/40 border border-cyber-border cursor-not-allowed'
                : 'bg-cyber-green/20 hover:bg-cyber-green/30 text-cyber-green border border-cyber-green/50 shadow-glowGreen'
            }`}
          >
            SUGGEST
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftColumn;

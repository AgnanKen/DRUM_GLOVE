import React, { useEffect } from 'react';
import { useGloveStore } from './store/useGloveStore';
import Header from './components/Header';
import LeftColumn from './components/LeftColumn';
import CenterColumn from './components/CenterColumn';
import RightColumn from './components/RightColumn';

export const App: React.FC = () => {
  const connectWebSocket = useGloveStore((s) => s.connectWebSocket);

  useEffect(() => {
    connectWebSocket();
  }, [connectWebSocket]);

  return (
    <div className="flex flex-col h-screen w-screen bg-cyber-bg text-cyber-textBright overflow-hidden font-sans select-none">
      {/* Top Navigation / Status Header */}
      <Header />

      {/* Main 3-Column Studio Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 min-h-0 overflow-hidden">
        {/* [LEFT COL] RH/LH glove sensors, calibration, connection */}
        <section className="lg:col-span-3 h-full min-h-0 overflow-hidden">
          <LeftColumn />
        </section>

        {/* [CENTER COL] LIVE 3D HAND, orbit controls, pulse on hit */}
        <section className="lg:col-span-5 h-full min-h-0 flex flex-col overflow-hidden">
          <CenterColumn />
        </section>

        {/* [RIGHT COL] Drum pads (14), MIDI status, Settings sliders, Activity log */}
        <section className="lg:col-span-4 h-full min-h-0 overflow-hidden">
          <RightColumn />
        </section>
      </main>
    </div>
  );
};

export default App;

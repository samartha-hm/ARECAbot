import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  Wifi, WifiOff, Activity, Navigation, Settings, 
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, 
  StopCircle, Play, Pause, RotateCcw, Box, Terminal,
  Cpu, Thermometer, Wind, MapPin
} from 'lucide-react';
import { api } from './services/api';
import { TelemetryData, LogEntry, Command } from './types';

export default function App() {
  const [connected, setConnected] = useState(false);
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    us: null, temp: null, pressure: null, state: '---', pos: null, dir: '---'
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [rollerOn, setRollerOn] = useState(false);
  
  // Speed States
  const [driveSpeed, setDriveSpeed] = useState(140);
  const [rollerSpeed, setRollerSpeed] = useState(140);

  // Joystick hold interval ref
  const holdInterval = useRef<number | null>(null);

  const addLog = useCallback((type: 'tx' | 'rx' | 'sys', message: string) => {
    setLogs(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message
    }, ...prev].slice(0, 100));
  }, []);

  useEffect(() => {
    api.onConnectChange = setConnected;
    api.onLog = (msg) => {
      // Determine type crudely for color coding
      const type = msg.startsWith('TX') ? 'tx' : msg.startsWith('RX') ? 'rx' : 'sys';
      addLog(type, msg.replace(/^(TX|RX|SYS):?\s*/, ''));
    };
    api.onTelemetry = (data) => {
      setTelemetry(prev => ({ ...prev, ...normalizeTelemetry(data) }));
    };
    api.connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizeTelemetry = (d: any): Partial<TelemetryData> => {
    return {
      us: d.us ?? d.US,
      temp: d.temp ?? d.T,
      pressure: d.pressure ?? d.P,
      state: d.state ?? d.ST,
      pos: Array.isArray(d.pos) ? d.pos : null,
      dir: d.dir ?? d.DIR
    };
  };

  // Command handlers
  const send = (cmd: string) => api.sendCmd(cmd);

  const handleSpeedChange = (type: 'LSPD' | 'RSPD' | 'ROLLERSPD', val: number) => {
    if (type === 'ROLLERSPD') setRollerSpeed(val);
    else setDriveSpeed(val);
    // Debounce could be added here, but direct send is usually fine for sliders
    // send(`${type} ${val}`); // Uncomment to send live on slide
  };

  const commitSpeed = (type: 'LSPD' | 'RSPD' | 'ROLLERSPD', val: number) => {
    send(`${type} ${val}`);
    if (type !== 'ROLLERSPD') {
        // Sync left/right for simple drive speed slider
        if (type === 'LSPD') send(`RSPD ${val}`);
    }
  };

  const toggleRoller = () => {
    const newState = !rollerOn;
    setRollerOn(newState);
    send(newState ? Command.ROLLER_ON : Command.ROLLER_OFF);
  };

  // Hold to move logic
  const startHold = (cmd: string) => {
    send(cmd);
    if (holdInterval.current) clearInterval(holdInterval.current);
    holdInterval.current = window.setInterval(() => send(cmd), 250);
  };

  const stopHold = () => {
    if (holdInterval.current) {
      clearInterval(holdInterval.current);
      holdInterval.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-areca-600 p-2 rounded-lg text-white">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">ArecaBot</h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">Autonomous Agriculture System</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${connected ? 'bg-areca-100 text-areca-800' : 'bg-red-100 text-red-800'}`}>
            {connected ? <Wifi size={16} /> : <WifiOff size={16} />}
            <span>{connected ? 'Connected' : 'Offline'}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Top Grid: Controls & Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COL: Control Panel */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Movement Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Navigation size={20} className="text-areca-600"/> Movement
                </h2>
                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">MANUAL MODE</span>
              </div>
              
              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-6">
                <div />
                <ControlButton icon={<ArrowUp size={32}/>} onDown={() => startHold(Command.FORWARD)} onUp={stopHold} color="blue" />
                <div />
                
                <ControlButton icon={<ArrowLeft size={32}/>} onDown={() => startHold(Command.LEFT)} onUp={stopHold} color="slate" />
                <ControlButton icon={<StopCircle size={32}/>} onClick={() => send(Command.STOP)} color="red" label="STOP" />
                <ControlButton icon={<ArrowRight size={32}/>} onDown={() => startHold(Command.RIGHT)} onUp={stopHold} color="slate" />
                
                <div />
                <ControlButton icon={<ArrowDown size={32}/>} onDown={() => startHold(Command.BACK)} onUp={stopHold} color="slate" />
                <div />
              </div>

              <div className="flex gap-3 justify-center pt-4 border-t border-gray-100">
                <ActionButton label="Auto Mode" icon={<Play size={16}/>} onClick={() => send(Command.AUTO)} active={false} color="green" />
                <ActionButton label="Manual" icon={<RotateCcw size={16}/>} onClick={() => send(Command.MANUAL)} active={false} color="slate" />
              </div>
            </div>

            {/* Mechanisms & Speed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Roller Control */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <Settings size={20} className="text-areca-600"/> Roller
                </h2>
                <button 
                  onClick={toggleRoller}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                    rollerOn 
                      ? 'bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-200' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Box size={24} />
                  {rollerOn ? 'ROLLER ON' : 'ROLLER OFF'}
                </button>
                
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2 font-medium text-gray-600">
                    <span>Speed</span>
                    <span>{rollerSpeed}</span>
                  </div>
                  <input 
                    type="range" min="0" max="255" 
                    value={rollerSpeed} 
                    onChange={(e) => handleSpeedChange('ROLLERSPD', parseInt(e.target.value))}
                    onMouseUp={() => commitSpeed('ROLLERSPD', rollerSpeed)}
                    onTouchEnd={() => commitSpeed('ROLLERSPD', rollerSpeed)}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-areca-600"
                  />
                </div>
              </div>

              {/* Drive Speed */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <Cpu size={20} className="text-areca-600"/> Drive
                </h2>
                
                <div className="space-y-6">
                   <div>
                    <div className="flex justify-between text-sm mb-2 font-medium text-gray-600">
                      <span>Motor Power</span>
                      <span>{driveSpeed}</span>
                    </div>
                    <input 
                      type="range" min="0" max="255" 
                      value={driveSpeed} 
                      onChange={(e) => handleSpeedChange('LSPD', parseInt(e.target.value))}
                      onMouseUp={() => commitSpeed('LSPD', driveSpeed)}
                      onTouchEnd={() => commitSpeed('LSPD', driveSpeed)}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                  
                  <button 
                     onClick={() => send(Command.STATUS)}
                     className="w-full py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Terminal size={18} /> Query Status
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COL: Telemetry & Logs */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Telemetry Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Activity size={20} className="text-areca-600"/> Telemetry
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <MetricCard label="Ultrasonic" value={telemetry.us ? `${telemetry.us} cm` : '--'} icon={<Wind size={16}/>} />
                <MetricCard label="Temperature" value={telemetry.temp ? `${telemetry.temp}°C` : '--'} icon={<Thermometer size={16}/>} />
                <MetricCard label="State" value={telemetry.state} icon={<Cpu size={16}/>} fullWidth />
                <MetricCard label="Position" value={telemetry.pos ? `X:${telemetry.pos[0]} Y:${telemetry.pos[1]}` : '--'} icon={<MapPin size={16}/>} />
                <MetricCard label="Direction" value={telemetry.dir} icon={<Navigation size={16}/>} />
              </div>
            </div>

            {/* Live Logs */}
            <div className="bg-slate-900 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[400px]">
               <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                 <h2 className="text-white font-mono text-sm font-bold flex items-center gap-2">
                   <Terminal size={16} className="text-areca-400"/> SYSTEM LOGS
                 </h2>
                 <span className="text-xs text-slate-500">{logs.length} events</span>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs">
                 {logs.length === 0 && <div className="text-slate-600 italic">No logs yet...</div>}
                 {logs.map((log) => (
                   <div key={log.id} className="flex gap-3">
                     <span className="text-slate-500 shrink-0">{log.timestamp}</span>
                     <span className={`
                       ${log.type === 'tx' ? 'text-blue-400' : ''}
                       ${log.type === 'rx' ? 'text-areca-400' : ''}
                       ${log.type === 'sys' ? 'text-slate-400' : ''}
                     `}>
                       {log.type.toUpperCase()}
                     </span>
                     <span className="text-slate-300 break-all">{log.message}</span>
                   </div>
                 ))}
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// Subcomponents

function ControlButton({ icon, label, onClick, onDown, onUp, color }: any) {
  const base = "w-full aspect-square rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95 shadow-sm border-b-4";
  const colors: any = {
    blue: "bg-blue-500 hover:bg-blue-600 border-blue-700 text-white",
    slate: "bg-white hover:bg-gray-50 border-gray-200 text-slate-700",
    red: "bg-red-500 hover:bg-red-600 border-red-700 text-white",
  };
  
  return (
    <button
      className={`${base} ${colors[color]}`}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      onClick={onClick}
    >
      {icon}
      {label && <span className="text-xs font-bold mt-1 uppercase tracking-wider">{label}</span>}
    </button>
  );
}

function ActionButton({ label, icon, onClick, color }: any) {
  const colors: any = {
    green: "bg-areca-600 hover:bg-areca-700 text-white",
    slate: "bg-slate-200 hover:bg-slate-300 text-slate-800",
  };
  return (
    <button onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-transform active:scale-95 ${colors[color]}`}>
      {icon} {label}
    </button>
  );
}

function MetricCard({ label, value, icon, fullWidth }: any) {
  return (
    <div className={`bg-gray-50 p-3 rounded-xl border border-gray-100 ${fullWidth ? 'col-span-2' : ''}`}>
      <div className="flex items-center gap-2 text-gray-500 mb-1 text-xs uppercase font-bold tracking-wider">
        {icon} {label}
      </div>
      <div className="text-xl font-bold text-slate-800 font-mono">
        {value}
      </div>
    </div>
  );
}
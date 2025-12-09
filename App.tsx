import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  Wifi, WifiOff, Activity, Navigation, Settings, 
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, 
  StopCircle, Play, Pause, RotateCcw, Box, Terminal,
  Cpu, Thermometer, Wind, MapPin, Gauge
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

  const commitSpeed = (type: 'LSPD' | 'RSPD' | 'ROLLERSPD', val: number) => {
    // Clamp value for robustness
    const safeVal = Math.min(255, Math.max(0, Math.floor(val)));
    
    if (type === 'ROLLERSPD') {
        setRollerSpeed(safeVal);
        send(`${type} ${safeVal}`);
    } else {
        setDriveSpeed(safeVal);
        // Sync left/right for simple drive speed control
        send(`LSPD ${safeVal}`);
        send(`RSPD ${safeVal}`);
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
    <div className="min-h-screen bg-gray-50 text-slate-800 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-areca-600 p-2 rounded-lg text-white shadow-md">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">ArecaBot</h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">Autonomous Agriculture System</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${connected ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
            {connected ? <Wifi size={16} /> : <WifiOff size={16} />}
            <span>{connected ? 'ONLINE' : 'OFFLINE'}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Top Grid: Controls & Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COL: Control Panel */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Movement Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-700">
                  <Navigation size={20} className="text-areca-600"/> Movement Control
                </h2>
                <span className="text-xs font-mono bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-bold border border-slate-200">MANUAL MODE</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
                <div />
                <ControlButton icon={<ArrowUp size={36}/>} onDown={() => startHold(Command.FORWARD)} onUp={stopHold} color="blue" label="FWD" />
                <div />
                
                <ControlButton icon={<ArrowLeft size={36}/>} onDown={() => startHold(Command.LEFT)} onUp={stopHold} color="slate" label="LEFT" />
                <ControlButton icon={<StopCircle size={36}/>} onClick={() => send(Command.STOP)} color="red" label="STOP" highlight />
                <ControlButton icon={<ArrowRight size={36}/>} onDown={() => startHold(Command.RIGHT)} onUp={stopHold} color="slate" label="RIGHT" />
                
                <div />
                <ControlButton icon={<ArrowDown size={36}/>} onDown={() => startHold(Command.BACK)} onUp={stopHold} color="slate" label="BACK" />
                <div />
              </div>

              <div className="flex gap-4 justify-center pt-6 border-t border-gray-100">
                <ActionButton label="Auto Mode" icon={<Play size={18}/>} onClick={() => send(Command.AUTO)} color="green" />
                <ActionButton label="Manual" icon={<RotateCcw size={18}/>} onClick={() => send(Command.MANUAL)} color="slate" />
              </div>
            </div>

            {/* Mechanisms & Speed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Roller Control */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-slate-700">
                  <Settings size={20} className="text-areca-600"/> Roller System
                </h2>
                
                <button 
                  onClick={toggleRoller}
                  className={`w-full py-6 rounded-xl font-bold text-xl flex items-center justify-center gap-3 transition-all mb-6 ${
                    rollerOn 
                      ? 'bg-amber-400 text-amber-950 shadow-lg shadow-amber-200 ring-2 ring-amber-500 ring-offset-2' 
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  <Box size={28} />
                  {rollerOn ? 'ACTIVE' : 'IDLE'}
                </button>
                
                <div className="mt-auto">
                   <SpeedControlInput 
                     label="Roller PWM" 
                     value={rollerSpeed} 
                     onCommit={(v) => commitSpeed('ROLLERSPD', v)} 
                   />
                </div>
              </div>

              {/* Drive Speed */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-slate-700">
                  <Cpu size={20} className="text-areca-600"/> Drive Configuration
                </h2>
                
                <div className="mb-6">
                    <SpeedControlInput 
                        label="Motor Power (PWM)" 
                        value={driveSpeed} 
                        onCommit={(v) => commitSpeed('LSPD', v)}
                    />
                </div>
                  
                <button 
                     onClick={() => send(Command.STATUS)}
                     className="mt-auto w-full py-4 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                    <Terminal size={18} /> System Diagnostics
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COL: Telemetry & Logs */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Telemetry Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-slate-700">
                <Activity size={20} className="text-areca-600"/> Live Telemetry
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <MetricCard label="Ultrasonic" value={telemetry.us ? `${telemetry.us} cm` : '--'} icon={<Wind size={16}/>} />
                <MetricCard label="Temperature" value={telemetry.temp ? `${telemetry.temp}°C` : '--'} icon={<Thermometer size={16}/>} />
                <MetricCard label="System State" value={telemetry.state} icon={<Cpu size={16}/>} fullWidth />
                <MetricCard label="Position" value={telemetry.pos ? `X:${telemetry.pos[0]} Y:${telemetry.pos[1]}` : '--'} icon={<MapPin size={16}/>} />
                <MetricCard label="Heading" value={telemetry.dir} icon={<Navigation size={16}/>} />
              </div>
            </div>

            {/* Live Logs */}
            <div className="bg-slate-900 rounded-2xl shadow-md overflow-hidden flex flex-col h-[450px] border border-slate-800">
               <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
                 <h2 className="text-gray-100 font-mono text-xs font-bold flex items-center gap-2 uppercase tracking-wider">
                   <Terminal size={14} className="text-areca-400"/> System Events
                 </h2>
                 <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{logs.length}</span>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[11px] leading-relaxed">
                 {logs.length === 0 && <div className="text-slate-600 italic text-center mt-10">Waiting for system logs...</div>}
                 {logs.map((log) => (
                   <div key={log.id} className="flex gap-3 hover:bg-white/5 p-1 rounded -mx-1 transition-colors">
                     <span className="text-slate-500 shrink-0 select-none">{log.timestamp}</span>
                     <span className={`font-bold shrink-0 w-8 text-center
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

// ----------------------------------------------------------------------
// Subcomponents
// ----------------------------------------------------------------------

function SpeedControlInput({ label, value, onCommit }: { label: string, value: number, onCommit: (val: number) => void }) {
  const [localVal, setLocalVal] = useState<string>(value.toString());

  useEffect(() => {
    setLocalVal(value.toString());
  }, [value]);

  const handleSubmit = () => {
    let v = parseInt(localVal);
    if (isNaN(v)) v = 0;
    if (v < 0) v = 0;
    if (v > 255) v = 255;
    
    setLocalVal(v.toString());
    onCommit(v);
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-2">
         <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
           {label}
         </label>
         <Gauge size={14} className="text-gray-400"/>
      </div>
      
      <div className="flex gap-2 mb-3">
        <input 
          type="number"
          min="0" max="255"
          value={localVal}
          onChange={(e) => setLocalVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-xl font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-areca-500 focus:border-transparent transition-all"
        />
        <button 
          onClick={handleSubmit}
          className="bg-slate-700 hover:bg-slate-800 active:scale-95 text-white rounded-lg px-5 font-bold transition-all shadow-sm"
        >
          SET
        </button>
      </div>

      <div className="flex justify-between items-center px-1">
          <div className="flex gap-1">
             {[0, 100, 140, 200, 255].map(v => (
                <button 
                  key={v}
                  onClick={() => { setLocalVal(v.toString()); onCommit(v); }} 
                  className="text-[10px] font-mono font-medium text-gray-400 hover:text-areca-600 hover:bg-white px-1.5 py-0.5 rounded border border-transparent hover:border-gray-200 transition-colors"
                >
                  {v}
                </button>
             ))}
          </div>
      </div>
    </div>
  )
}

function ControlButton({ icon, label, onClick, onDown, onUp, color, highlight }: any) {
  const base = "w-full aspect-square rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95 shadow-sm border-b-4 relative overflow-hidden group";
  const colors: any = {
    blue: "bg-blue-500 hover:bg-blue-600 border-blue-700 text-white active:border-b-0 active:translate-y-1",
    slate: "bg-white hover:bg-gray-50 border-gray-200 text-slate-700 active:bg-gray-100 active:border-gray-300 active:border-b-0 active:translate-y-1",
    red: "bg-red-500 hover:bg-red-600 border-red-700 text-white active:border-b-0 active:translate-y-1",
  };
  
  return (
    <button
      className={`${base} ${colors[color]} ${highlight ? 'ring-4 ring-red-100' : ''}`}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      onClick={onClick}
    >
      <div className="relative z-10 flex flex-col items-center">
        {icon}
        {label && <span className="text-[10px] font-bold mt-1 uppercase tracking-wider opacity-80">{label}</span>}
      </div>
      {color === 'slate' && <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity" />}
    </button>
  );
}

function ActionButton({ label, icon, onClick, color }: any) {
  const colors: any = {
    green: "bg-areca-600 hover:bg-areca-700 text-white shadow-lg shadow-areca-100",
    slate: "bg-slate-200 hover:bg-slate-300 text-slate-800",
  };
  return (
    <button onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all active:scale-95 ${colors[color]}`}>
      {icon} {label}
    </button>
  );
}

function MetricCard({ label, value, icon, fullWidth }: any) {
  return (
    <div className={`bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-areca-200 transition-colors group ${fullWidth ? 'col-span-2' : ''}`}>
      <div className="flex items-center gap-2 text-gray-500 mb-2 text-xs uppercase font-bold tracking-wider group-hover:text-areca-600 transition-colors">
        {icon} {label}
      </div>
      <div className="text-xl font-bold text-slate-800 font-mono tracking-tight">
        {value}
      </div>
    </div>
  );
}
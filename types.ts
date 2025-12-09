export interface TelemetryData {
  us: number | null;        // Ultrasonic distance (cm)
  temp: number | null;      // Temperature (C)
  pressure: number | null;  // Pressure (hPa)
  state: number | string;   // Robot State ID or Name
  pos: [number, number] | null; // Grid Position [x, y]
  dir: number | string;     // Direction
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'tx' | 'rx' | 'sys';
}

export enum Command {
  FORWARD = 'F',
  BACK = 'B',
  LEFT = 'L',
  RIGHT = 'R',
  STOP = 'STOP',
  AUTO = 'AUTO',
  MANUAL = 'MANUAL',
  STATUS = 'STATUS',
  ROLLER_ON = 'ROLLER ON',
  ROLLER_OFF = 'ROLLER OFF'
}

export const ROBOT_HOST = window.location.hostname || '192.168.4.1';
export const ROBOT_PORT = 8765;
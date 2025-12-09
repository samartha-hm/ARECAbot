import { io, Socket } from 'socket.io-client';
import { Command, ROBOT_HOST, ROBOT_PORT } from '../types';

const HTTP_URL = `http://${ROBOT_HOST}:${ROBOT_PORT}/cmd`;
const WS_URL = `http://${ROBOT_HOST}:${ROBOT_PORT}`;

class RobotApi {
  private socket: Socket | null = null;
  public onTelemetry: ((data: any) => void) | null = null;
  public onLog: ((msg: string) => void) | null = null;
  public onAck: ((msg: string) => void) | null = null;
  public onConnectChange: ((connected: boolean) => void) | null = null;

  connect() {
    this.socket = io(WS_URL, {
      transports: ['websocket'],
      timeout: 5000,
      reconnectionAttempts: 10
    });

    this.socket.on('connect', () => {
      this.onConnectChange?.(true);
      this.log('SYS', 'WebSocket Connected');
    });

    this.socket.on('disconnect', () => {
      this.onConnectChange?.(false);
      this.log('SYS', 'WebSocket Disconnected');
    });

    this.socket.on('message', (payload: any) => {
      let obj = payload;
      if (typeof payload === 'string') {
        try {
          obj = JSON.parse(payload);
        } catch (e) {
          this.log('RX', payload);
          return;
        }
      }

      if (obj.type === 'telemetry') {
        this.onTelemetry?.(obj.data);
      } else if (obj.type === 'ack') {
        this.onAck?.(JSON.stringify(obj.data));
        this.log('RX', `ACK: ${JSON.stringify(obj.data)}`);
      } else if (obj.type === 'log') {
        this.log('RX', `LOG: ${obj.data}`);
      } else {
        this.log('RX', `MSG: ${JSON.stringify(obj)}`);
      }
    });

    this.socket.on('telemetry', (t: any) => this.onTelemetry?.(t));
  }

  private log(type: string, msg: string) {
    // Internal logging logic handled by App component via callbacks usually, 
    // but here we just trigger the callback
    if (this.onLog) this.onLog(msg); 
  }

  async sendCmd(cmd: string) {
    // 1. Try WebSocket
    if (this.socket && this.socket.connected) {
      this.socket.emit('cmd', { cmd });
      this.log('TX', `WS: ${cmd}`);
      return;
    }

    // 2. Fallback to HTTP
    try {
      this.log('TX', `HTTP: ${cmd} (Fallback)`);
      const res = await fetch(HTTP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ c: cmd })
      });
      const text = await res.text();
      this.log('RX', `HTTP Resp: ${text}`);
    } catch (e: any) {
      this.log('SYS', `HTTP Send Failed: ${e.message}`);
    }
  }
}

export const api = new RobotApi();
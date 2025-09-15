import { ServiceWahl } from "../../../viewModels/cowi/rezepturEnums";
import { rezService } from "../../../viewModels/cowi/services/rezService";
type StateCallback = (state: boolean) => void;

class WsWatchdog {
  private static instance: WsWatchdog;
  private timers: number[] = [];
  private ws1Callbacks: Map<number, StateCallback> = new Map();
  private ws2Callbacks: Map<number, StateCallback> = new Map();
  private ws3Callbacks: Map<number, StateCallback> = new Map();
  private ws4Callbacks: Map<number, StateCallback> = new Map();
  private callbackId: number = 0;

  private constructor() { }

  public static getInstance(): WsWatchdog {
    if (!WsWatchdog.instance) {
      WsWatchdog.instance = new WsWatchdog();
    }
    return WsWatchdog.instance;
  }

  public addWs1Callback(callback: StateCallback): number {
    const id = this.callbackId++;
    this.ws1Callbacks.set(id, callback);
    this.checkAndStartTimers();
    return id;
  }

  public addWs2Callback(callback: StateCallback): number {
    const id = this.callbackId++;
    this.ws2Callbacks.set(id, callback);
    this.checkAndStartTimers();
    return id;
  }

  public addWs3Callback(callback: StateCallback): number {
    const id = this.callbackId++;
    this.ws3Callbacks.set(id, callback);
    this.checkAndStartTimers();
    return id;
  }

  public addWs4Callback(callback: StateCallback): number {
    const id = this.callbackId++;
    this.ws4Callbacks.set(id, callback);
    this.checkAndStartTimers();
    return id;
  }

  public removeWs1Callback(id: number): void {
    this.ws1Callbacks.delete(id);
    this.checkAndStopTimers();
  }

  public removeWs2Callback(id: number): void {
    this.ws2Callbacks.delete(id);
    this.checkAndStopTimers();
  }

  public removeWs3Callback(id: number): void {
    this.ws3Callbacks.delete(id);
    this.checkAndStopTimers();
  }

  public removeWs4Callback(id: number): void {
    this.ws4Callbacks.delete(id);
    this.checkAndStopTimers();
  }

  public dispose(): void {
    this.stop();
  }

  private start(): void {
    this.watchdog();
  }

  private stop(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers = [];
  }

  private checkAndStartTimers(): void {
    if (this.hasActiveCallbacks() && this.timers.length === 0) {
      this.start();
    }
  }

  private checkAndStopTimers(): void {
    if (!this.hasActiveCallbacks()) {
      this.stop();
    }
  }

  private hasActiveCallbacks(): boolean {
    return (
      this.ws1Callbacks.size > 0 ||
      this.ws2Callbacks.size > 0 ||
      this.ws3Callbacks.size > 0 ||
      this.ws4Callbacks.size > 0
    );
  }

  /** Lebenszeichen von Webservices */
  protected watchdog(): void {
    const createTimer = (
      service: ServiceWahl,
      stateSetter: (state: boolean) => void,
      interval: number
    ) => {
      const tick = async () => {
        try {
          const response: IServerTime = await rezService.getServerTime(service);
          stateSetter(moment(response).isValid());
        } catch {
          stateSetter(false);
        } finally {
          // wichtig beim Disposen die Timer n. mehr rekursiv aufzurufen
          if (this.hasActiveCallbacks()) {
            const newTimer: any = setTimeout(tick, interval);
            this.timers.push(newTimer);
          }
        }
      };
      // Sofortiger Aufruf
      const newTimer: any = setTimeout(tick, 1);
      this.timers.push(newTimer);
    };

    const period = 5000;
    createTimer(ServiceWahl.wcfSiem, this.setWs1State.bind(this), period);
    createTimer(ServiceWahl.WcfRezept, this.setWs2State.bind(this), period);
    createTimer(ServiceWahl.WsCwSAP, this.setWs3State.bind(this), period);
    createTimer(ServiceWahl.WsCcwBde, this.setWs4State.bind(this), period);
  }

  // Setter-Methoden für den Zustand der Webservices
  private setWs1State(state: boolean): void {
    this.ws1Callbacks.forEach(callback => callback(state));
  }

  private setWs2State(state: boolean): void {
    this.ws2Callbacks.forEach(callback => callback(state));
  }

  private setWs3State(state: boolean): void {
    this.ws3Callbacks.forEach(callback => callback(state));
  }

  private setWs4State(state: boolean): void {
    this.ws4Callbacks.forEach(callback => callback(state));
  }
}

export = WsWatchdog;
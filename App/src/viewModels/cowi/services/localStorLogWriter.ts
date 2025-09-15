class localStorLogWriter {
  private logQueue: { key: string; log: string }[];
  private intervalId: number;

  constructor() {
    this.logQueue = [];
  }

  addToLogQueue(key: string, log: string) {
    // Füge den Log-Eintrag zur Warteschlange hinzu
    this.logQueue.push({ key, log });
  }
  // Warteschlange
  processLogQueue() {
    let url = window.location.href;
    // Überprüfe, ob es Log-Einträge in der Warteschlange gibt
    if (this.logQueue.length > 0) {
      // Entferne den ersten Log-Eintrag aus der Warteschlange
      let { key, log } = this.logQueue.shift();
      let event = new StorageEvent("storage", { key, newValue: log, url });
      // Speichere den Log-Eintrag im LocalStorage
      localStorage.setItem(key, log);
      window.dispatchEvent(event); // dies ist notwendig um 'storage'-Event anzustoßen
    }
  }

  startProcessing() {
    // Rufe die processLogQueue-Methode regelmäßig auf
    this.intervalId = setInterval(
      () => this.processLogQueue(), 500
    ) as undefined as number;
  }

  stopProcessing() {
    // Lösche den Interval
    clearInterval(this.intervalId);
  }
}

export = localStorLogWriter;

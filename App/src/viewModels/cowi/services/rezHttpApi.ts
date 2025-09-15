import HttpService = require("../../../services/http");

class RezHttpApi {
  protected async http<T>(
    serviceName: string,
    methodName: string,
    method: string,
    args?: any,
    timeout?: number
  ): Promise<T> {
    let baseUrl = `${serviceName}.svc/js/${methodName}`;

    if (method.toLowerCase() === "get") {
      const params = new URLSearchParams();
      for (const key in args) {
        if (args.hasOwnProperty(key)) {
          params.append(key, args[key]);
        }
      }
      baseUrl =
        Array.from(params).length > 0
          ? `${baseUrl}?${params.toString()}`
          : baseUrl;
      args = null;
    }

    const call = () =>
      fetch(baseUrl, {
        method: method,
        body: args !== null && args !== void 0 ? JSON.stringify(args) : null,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });

    if (this.isTimeout(timeout)) {
      return this.time_out<T>({
        ms: timeout,
        promise: call,
        methodName,
      });
    } else {
      return call()
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Methodname: ${methodName}; HTTP status: ${response.status}`
            );
          }
          return response.json() as Promise<T>;
        })
        .catch((ex) => {
          console.error(`Error in ${methodName}:`, ex);
          if (ex instanceof TypeError) {
            console.error("Network error or CORS issue:", ex);
          }
          // Ensure the rejection is an Error object
          throw ex instanceof Error ? ex : new Error(JSON.stringify(ex));
        });
    }
  }

  // Diese Methode wird für den OPUS Webservice benötigt.
  // Sie darf keine try-catch-Anweisung enthalten, da OPUS keine standardmäßigen HTTP-Statuscodes verwendet.
  // Bei einem Fehler – z. B. wenn ein Produktionsauftrag (PA) ungültig ist –
  // liefert OPUS stattdessen eine 500er-Fehlermeldung (Server Error) mit einer erklärenden Nachricht im Response-Body.
  // Diese Nachricht muss ausgewertet werden, um den Fehler korrekt zu erkennen und zu behandeln.
  protected async post<T>(
    serviceName: string,
    methodName: string,
    args: any,
    timeout?: number
  ): Promise<T> {
    var url = `${serviceName}.svc/js/${methodName}`;

    return this.isTimeout(timeout)
      ? this.time_out<T>({
        ms: timeout,
        promise: HttpService.post<T>(url, args),
        methodName: methodName,
      })
      : await HttpService.post<T>(url, args);
  }

  protected async get<T>(
    serviceName: string,
    methodName: string,
    timeout?: number
  ): Promise<T> {
    var url = `${serviceName}.svc/js/${methodName}`;

    return this.isTimeout(timeout)
      ? this.time_out<T>({
        ms: timeout,
        promise: HttpService.get<T>(url),
        methodName: methodName,
      })
      : await HttpService.get<T>(url);
  }

  private async time_out<T>({ ms, promise, methodName }): Promise<T> {
    let t: any;
    return new Promise<T>(async (resolve, reject) => {
      t = setTimeout(() => {
        reject(new Error(`Zeitüberlauf => call method '${methodName}'`));
      }, ms);
      try {
        const response = await promise();
        if (!response.ok) {
          throw new Error(
            `Methodname: ${methodName}; HTTP status: ${response.status}`
          );
        }
        resolve(response.json() as Promise<T>);
      } catch (ex) {
        console.error(`Error in ${methodName}:`, ex);
        if (ex.name === "AbortError") {
          // Anfrage wurde abgebrochen
          return;
        }
        reject(ex instanceof Error ? ex : new Error(JSON.stringify(ex)));
      } finally {
        clearTimeout(t);
      }
    });
  }

  private isTimeout(timeout?: number): boolean {
    return typeof timeout === "number" && timeout > 0;
  }
}
export = RezHttpApi;

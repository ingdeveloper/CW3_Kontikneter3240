class DtHandle {
  private startDT: any; // HTMLInputElement;
  private stopDT: any; // HTMLInputElement;
  private $dtPickerStart: any;
  private $dtPickerStop: any;
  private startDtValue: any;
  private stopDtValue: any;
  private format: string = "DD.MM.YYYY HH:mm:ss";
  /** definiert die Prüfungslogik ob die eingegebene Stoppzeit limitiert werden soll */
  private checkDT: boolean;

  /**
   * Bootstrap 3 Datepicker handling
   * @param dtPickerStart ID des Start-Pickers
   * @param dtPickerStop ID des End-Pickers
   */
  constructor(
    dtPickerStart: string,
    dtPickerStop: string,
    startDT?: string,
    stopDT?: string
  ) {
    this.$dtPickerStart = $(`#${dtPickerStart}`).length
      ? $(`#${dtPickerStart}`)
      : null;
    this.$dtPickerStop = $(`#${dtPickerStop}`).length
      ? $(`#${dtPickerStop}`)
      : null;

    // if (!this.$dtPickerStart || !this.$dtPickerStop) {
    //     console.log(`%cHtmlElement m. ID - ${dtPickerStart} bzw. ${dtPickerStop} n. gefunden`, "color:red");
    //     return;
    // }
    // man geht davon dass, vorgegebene Initialisierungszeiten erfordern auch die Aktivierung der Prüfungslogik
    this.checkDT = startDT === void 0 || stopDT === void 0 ? false : true;

    this.initDTs(
      startDT === void 0
        ? moment(moment().subtract(1, "days"))
        : moment(moment(startDT, this.format)),
      stopDT === void 0
        ? moment(moment().add(1, "days"))
        : moment(moment(stopDT, this.format))
    );
  }

  /** Bootstrap 3 Datepicker initialisieren */
  protected initDTs(startDT: moment.Moment, stopDT: moment.Moment): void {
    const self: this = this;
    const minDT: Date = new Date(1990, 1, 1, 0, 0, 0);
    const maxDT: Date = new Date(2088, 12, 31, 23, 59, 59);

    if (self.$dtPickerStart) {
      self.$dtPickerStart.datetimepicker({
        date: startDT,
        format: self.format,
        maxDate: maxDT,
        minDate: minDT,
      });

      self.startDT = self.$dtPickerStart.children("input").length
        ? self.$dtPickerStart.children("input")
        : undefined;

      self.startDT
        .on("blur", () => {
          self.checkDTInputs(self);
        })
        .on("input", () => {
          self.checkDTInputs(self);
        });
    }

    if (self.$dtPickerStop) {
      self.$dtPickerStop.datetimepicker({
        date: stopDT,
        format: self.format,
        maxDate: maxDT,
        minDate: minDT,
      });

      self.stopDT = self.$dtPickerStop.children("input").length
        ? self.$dtPickerStop.children("input")
        : undefined;
      // if (!self.startDT || !self.stopDT) {
      //   console.log(`%c'Input' - HtmlElement n. gefunden`, "color:red");
      //   return;
      // }

      self.stopDT
        .on("blur", () => {
          self.checkDTInputs(self);
        })
        .on("input", () => {
          self.checkDTInputs(self);
        });
    }
    self.checkDTInputs(self);
  }

  public get startZeit(): string {
    return this.startDtValue != void 0
      ? this.startDtValue.format(this.format)
      : moment(this.startDT[0].value, this.format).format(this.format);
  }

  public get stoppZeit(): string {
    return this.stopDtValue != void 0
      ? this.stopDtValue.format(this.format)
      : moment(this.stopDT[0].value, this.format).format(this.format);
  }

  /** Settzt die Startzeit auf aktuelles Datum/-Zeit */
  public setStart(): void {
    this.startDT[0].value = moment().format(this.format);
    this.checkDTInputs(this);
  }

  /** Settzt die Stopptzeit auf aktuelles Datum/-Zeit */
  public setStop(): void {
    this.stopDT[0].value = moment().format(this.format);
    this.checkDTInputs(this);
  }

  /** Plausibilitätsprüfung */
  protected checkDTInputs(self: any): void {
    if (!(this.$dtPickerStart && this.$dtPickerStop)) return;
    this.startDtValue = moment(self.startDT[0].value, this.format);
    this.stopDtValue = moment(self.stopDT[0].value, this.format);
    if (this.startDtValue.diff(this.stopDtValue) >= 0) {
      let txtInfo = "die Startzeit darf nicht größer als Stoppzeit sein";
      this.startDT[0].setCustomValidity(txtInfo);
      this.stopDT[0].setCustomValidity(txtInfo);
      // } else if (this.checkDT && this.stopDtValue.diff(moment()) < 0) {
    } else if (this.checkDT && this.stopDtValue.diff(this.startDtValue) < 0) {
      let txtInfo = "die Stoppzeit darf nicht in der Vergangeheit liegen";
      this.startDT[0].setCustomValidity("");
      this.stopDT[0].setCustomValidity(txtInfo);
    } else {
      this.startDT[0].setCustomValidity("");
      this.stopDT[0].setCustomValidity("");
    }
  }
}
export = DtHandle;

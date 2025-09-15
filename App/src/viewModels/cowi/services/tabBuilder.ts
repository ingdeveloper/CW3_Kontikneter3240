// #Quelle - https://stackoverflow.com/questions/18395976/how-to-display-a-json-array-in-table-format
class TabBuilder {
  private data = [];
  private headArr;
  private bodyArr;

  private headData(): any {
    for (const row of this.data) {
      // nur erste Zeile abarbeiten als Head
      if (this.headArr.length !== 0) {
        break;
      }
      // #Head-Daten füllen
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          this.headArr.push(key);
        }
      }
    }
    return this.headArr;
  }

  public getHeadData(data: any): any {
    const len: number = data.length;
    if (!len || len < 1) {
      return [];
    }
    this.headArr = [];
    this.data = data;
    return this.headData();
  }

  private bodyData(): any {
    // alle Elemente durchlaufen
    for (const row of this.data) {
      // const row: any = this.data[i];

      // #Body-Daten füllen
      const rows: any = [];
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          rows.push(row[key]);
        }
      }
      // verhindern das NULL Zeilen eingefügt werden.
      !rows.every((element) => element === null) && this.bodyArr.push(rows);
    }
    return this.bodyArr;
  }

  public getBodyData(data: any): any {
    const len: number = data.length;
    if (!len || len < 1) {
      return [];
    }
    this.bodyArr = [];
    this.data = data;
    return this.bodyData();
  }
}
export = TabBuilder;

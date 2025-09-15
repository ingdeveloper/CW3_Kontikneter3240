// Quelle - https://stackoverflow.com/questions/18395976/how-to-display-a-json-array-in-table-format
define([], function () {
  var ctor = function (data) {
    var self = this;
    self.data = data;
    self.headArr = [];
    self.bodyArr = [];

    var len = self.data.length;
    if (!len || len < 1) { return; }
    // alle Elemente durchlaufen
    for (var i = 0; i < len; i++) {
      var row = self.data[i];
      var key = {};
      // Head-Daten füllen
      if (self.headArr.length === 0) {
        for (key in row) {
          if (row.hasOwnProperty(key)) {
            self.headArr.push(key);
          }
        }
      }
      // Body-Daten füllen
      var tmpArr = [];
      for (key in row) {
        if (row.hasOwnProperty(key)) {
          tmpArr.push(row[key]);
        }
      }
      self.bodyArr.push(tmpArr);
    }
  };
  return ctor;
});

define(["require", "exports"], function (require, exports) {
    "use strict";
    var createColor = (function () {
        function createColor() {}
        createColor.color = function (i) {
            if (i == 0)
                return "rgba(255,255,255,1)";
            var red = Math.sin(i * 200000 * this.pi / 255.000000000 + this.pi);
            var green = Math.sin(i * 2000 * this.pi / 255.000000000 - this.pi / 2);
            var blue = Math.sin(i * 500000 * this.pi / 255.000000000);
            red = red * 0.5 * 255;
            green = green * 0.5 * 255;
            blue = blue * 0.5 * 255;
            var Color = Uint8Array.from([red, green, blue]);
            return "rgba(" + Color[0] + "," + Color[1] + "," + Color[2] + ",0.5)";
        };
        createColor.pi = 3.14;
        return createColor;
    }());
    return createColor;
});
ko.bindingHandlers.setContrastColor = {
    update: function (element, valueAccessor) {
        var color = valueAccessor().color || hexc($(element).css('background-color'));

        // Check if the the variable color contain a hex color string
        if (/^#[0-9A-F]{6}$/i.test(color) !== true) return;

        var hex = '#';
        var r, g, b;
        if (color.indexOf(hex) > -1) {
            r = parseInt(color.substr(1, 2), 16);
            g = parseInt(color.substr(3, 2), 16);
            b = parseInt(color.substr(5, 2), 16);
        } else {
            color = color.match(/\d+/g);
            r = color[0];
            g = color[1];
            b = color[2];
        }

        var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        $(element).css('color', (yiq >= 128) ? 'black' : 'white');
    },
};

function hexc(colorval) {
    var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    delete (parts[0]);
    for (var i = 1; i <= 3; ++i) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length == 1) parts[i] = '0' + parts[i];
    }
    var color = '#' + parts.join('');

    return color;
}
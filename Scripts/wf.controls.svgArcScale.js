/**
 * Bingind handler for an SVG arc scale, without any dependencies for other libraries
 * 
**/
ko.bindingHandlers.svgArcScale = {

    namespace: "http://www.w3.org/2000/svg",
    scalePrefix: "wf-arc-scale",

    drawScale: function (scale, size, labelsOffset, delta, startAngle, endAngle, ticksNumber, scaleIncrement, scaleStart, linesVisible, labelsVisible) {
        var offset = 0;
        var rad = (Math.PI * 2) / 360;
        var r1 = (size / 2);
        var x1 = r1 + r1,
            y1 = r1;
        var r2 = r1 - delta;
        var x2 = offset,
            y2 = r1;
        var x3 = x1 - delta,
            y3 = r1;

        sr2 = r2;
        srT = r1 + labelsOffset; //text offset
        var n = scaleStart; // scale start
        for (var sa = startAngle + 90; sa <= endAngle + 90; sa += (endAngle - startAngle) / (ticksNumber - 1)) {
            var sx1 = r1 - r1 * Math.sin(sa * rad);
            var sy1 = r1 - r1 * Math.cos(sa * rad);
            var sx2 = r1 - sr2 * Math.sin(sa * rad);
            var sy2 = r1 - sr2 * Math.cos(sa * rad);
            var sxT = r1 - srT * Math.cos(sa * rad);
            var syT = r1 - srT * Math.sin(sa * rad);
            var scaleLine = document.createElementNS(ko.bindingHandlers.svgArcScale.namespace, "line");
            var scaleLineObj = {
                class: "line" + (linesVisible === false ? " hidden" : ""),
                y1: sx1,
                x1: sy1,
                y2: sx2,
                x2: sy2
            };
            ko.bindingHandlers.svgArcScale.setSVGAttributes(scaleLine, scaleLineObj);
            scale.appendChild(scaleLine);
            var scaleText = document.createElementNS(ko.bindingHandlers.svgArcScale.namespace, "text");
            var scaleTextObj = {
                class: "text" + (labelsVisible === false ? " hidden" : ""),
                y: syT + 5,
                x: sxT
            };
            ko.bindingHandlers.svgArcScale.setSVGAttributes(scaleText, scaleTextObj);
            scaleText.textContent = n * scaleIncrement; //scale increment
            scale.appendChild(scaleText);
            n++;
        }
    },

    setSVGAttributes: function (elmt, oAtt) {
        for (var prop in oAtt) {
            elmt.setAttributeNS(null, prop, oAtt[prop]);
        }
    },

    update: function (element, valueAccessor) {
        var options = valueAccessor();
        var $element = $(element);

        var gClass = ko.unwrap(options.gClass) !== undefined ? ko.unwrap(options.gClass) : "scale";
        var svgClass = ko.unwrap(options.svgClass) !== undefined ? ko.unwrap(options.svgClass) : "wf-svg-scale-container";

        var size = ko.unwrap(options.size) !== undefined ? ko.unwrap(options.size) : 200;
        var startAngle = ko.unwrap(options.startAngle) !== undefined ? ko.unwrap(options.startAngle) : 0;
        var endAngle = ko.unwrap(options.endAngle) !== undefined ? ko.unwrap(options.endAngle) : 180;
        var ticksLenght = ko.unwrap(options.ticksLenght) !== undefined ? ko.unwrap(options.ticksLenght) : 20;
        var labelsOffset = ko.unwrap(options.labelsOffset) !== undefined ? ko.unwrap(options.labelsOffset) : 10;
        var scaleStart = ko.unwrap(options.scaleStart) !== undefined ? ko.unwrap(options.scaleStart) : 0;
        var ticksNumber = ko.unwrap(options.ticksNumber) !== undefined ? ko.unwrap(options.ticksNumber) : 10;
        var scaleIncrement = ko.unwrap(options.scaleIncrement) !== undefined ? ko.unwrap(options.scaleIncrement) : 10;

        var linesVisible = ko.unwrap(options.linesVisible) !== undefined ? ko.unwrap(options.linesVisible) : true;
        var labelsVisible = ko.unwrap(options.labelsVisible) !== undefined ? ko.unwrap(options.labelsVisible) : true;

        $element.empty();

        var div = document.createElement("div");
        div.className = "wf-scale-container";

        var svg = document.createElementNS(ko.bindingHandlers.svgArcScale.namespace, "svg");
        svg.setAttribute("width", size);
        svg.setAttribute("height", size);
        svg.setAttribute("class", svgClass);
        //svg.setAttribute("viewBox", "0 0" + " " + size + " " + size);

        var scale = document.createElementNS(ko.bindingHandlers.svgArcScale.namespace, "g");
        scale.setAttributeNS(null, "class", "scale " + ko.bindingHandlers.svgArcScale.scalePrefix);

        svg.appendChild(scale);
        div.appendChild(svg);
        element.appendChild(div);

        ko.bindingHandlers.svgArcScale.drawScale(scale, size, labelsOffset, ticksLenght, startAngle, endAngle, ticksNumber, scaleIncrement, scaleStart, linesVisible, labelsVisible);
    }
}
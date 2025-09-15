// Knockout binding handler d3 axis
// Source: https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Axes.md
// Optional parameters: 
// @width
// @orientation
// @cssClass
// @maxValue
// @minValue
// @ticksCount
// @revertAxis

// Example:  <div data-bind="d3axis:{cssClass: 'x axis', ticksCount: 10, width: 310, orientetion}"></div>
ko.bindingHandlers.d3axis = {
    init: function (element, valueAccessor) {

        var d3Axis = valueAccessor();
        var $element = $(element);
        var parent = $element.parent();

        var id = uuid.v4();

        var orientation = ko.unwrap(d3Axis.orientation) || "bottom";
        var cssClass = ko.unwrap(d3Axis.cssClass) || "axis";

        var isVertical = orientation.indexOf("bottom") === -1 && orientation.indexOf("top") === -1;
        var revertAxis = ko.unwrap(d3Axis.revertAxis) !== undefined ? ko.unwrap(d3Axis.revertAxis) : false;

        var maxValue = ko.unwrap(d3Axis.maxValue) || 100;
        var minValue = ko.unwrap(d3Axis.minValue) || 0;
        var ticksCount = ko.unwrap(d3Axis.ticksCount) || 3;

        var optionHeight = ko.unwrap(d3Axis.height);
        var optionWidth = ko.unwrap(d3Axis.width);

        var defaultWidth = 20;
        var defaultHeight = 20;

        var width = function() {
            if (optionWidth) {
                return optionWidth;
            }
            return isVertical ? defaultWidth : parent.width();
        };

        var height = function() {
            if (optionHeight) {
                return optionHeight;
            }
            return !isVertical ? defaultHeight : parent.height();
        };

        var resize = function() {
            $("#axis_" + id).css("width", width());
            $("#axis_" + id).css("height", height());
            xScale.range(getAxisRange(isVertical, revertAxis, width(), height()));
            d3.select("#axis_" + id).call(axis);
        };

        var xScale = d3.scale.linear()
            .domain([minValue, maxValue])
            .range(getAxisRange(isVertical, revertAxis, width(), height()))
            .nice();


        var axis = d3.svg.axis()
            .scale(xScale)
            .orient(orientation)
            .ticks(ticksCount)
            .tickValues(getLiniarTickValues(minValue, maxValue, ticksCount))
            .tickFormat(d3.localizedNumberFormat(">"));

        var svg = d3.select($element[0]).append("svg")
            .attr("id", "axis_" + id)
            .attr("class", cssClass)
            .attr("width", width())
            .attr("height", height());

        svg.append("g")
            .call(axis);

        ko.utils.domData.set(element, "id", id);
        ko.utils.domData.set(element, "xScale", xScale);
        ko.utils.domData.set(element, "axis", axis);

        $(window).resize(resize);

        // Dispose
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(window).off("resize");
        });

        setTimeout(resize, 250);
    },

    update: function (element, valueAccessor) {

        var d3Axis = valueAccessor();

        var xScale = ko.utils.domData.get(element, 'xScale');
        var axis = ko.utils.domData.get(element, 'axis');
        var id = ko.utils.domData.get(element, 'id');

        var maxValue = ko.unwrap(d3Axis.maxValue) || 100;
        var minValue = ko.unwrap(d3Axis.minValue) || 0;

        xScale.domain([minValue, maxValue]);
        d3.select("#axis_" + id).call(axis);
    }
};

function getAxisRange(isVertical, revertAxis, width, height) {
    var startRange, endRange;

    if (isVertical) {
        startRange = revertAxis ? 0 : height;
        endRange = revertAxis ? height : 0;
    } else {
        startRange = revertAxis ? width : 0;
        endRange = revertAxis ? 0 : width;
    }

    return [startRange, endRange];
}

function getLiniarTickValues(minValue, maxValue, ticksCount) {
    var step = (maxValue - minValue) / (ticksCount - 1);
    var values = [];

    for (var i = 0; i < ticksCount; i++) {
        values.push(minValue + i * step);
    }

    return values;
}
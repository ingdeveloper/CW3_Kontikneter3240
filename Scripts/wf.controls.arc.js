// Binding handler for an arc path with D3
// Optional parameters: 
// @width
// @height
// @padding
// @innerRadius
// @startAngle
// @endAngle
// @minRange
// @maxRange
// @animated
// @animationDuration
// @foregroundColor
// @backgroundColor
// @foregroundStrokeColor
// @backgroundStrokeColor
// @strokeWidth
// @majorTicks
// @showTickLines
// @showTickLabels
// @labelFormat

// Example:  <div data-bind="arc: angleValue, arcOptions: { width: 200, height: 200, foregroundColor: '#880000', innerRadius: 0.975, startAngle: 0, endAngle: 360 }"></div>

ko.bindingHandlers.arc = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var $element = $(element);
        var value = ko.unwrap(valueAccessor);
        var options = allBindingsAccessor().arcOptions || {};
        var r2d = Math.PI / 180;

        var width = ko.unwrap(options.width) !== undefined ? ko.unwrap(options.width) : 100;
        var height = ko.unwrap(options.height) !== undefined ? ko.unwrap(options.height) : 100;
        var paddings = ko.unwrap(options.paddings) || {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };

        var radius = Math.min(width - options.paddings.left - options.paddings.right, height - options.paddings.top - options.paddings.bottom) / 2;

        var minRange = ko.unwrap(options.minRange) !== undefined ? ko.unwrap(options.minRange) : 0;
        var maxRange = ko.unwrap(options.maxRange) !== undefined ? ko.unwrap(options.maxRange) : 100;

        var majorTicks = ko.unwrap(options.majorTicks) !== undefined ? ko.unwrap(options.majorTicks) : 20;
        var showTickLines = ko.unwrap(options.showTickLines) !== undefined ? ko.unwrap(options.showTickLines) : true;
        var showTickLabels = ko.unwrap(options.showTickLabels) !== undefined ? ko.unwrap(options.showTickLabels) : false;
        var labelFormat = ko.unwrap(options.labelFormat) || d3.format(',g');

        var innerRadius = ko.unwrap(options.innerRadius) !== undefined ? ko.unwrap(options.innerRadius) : 0.5;
        var startAngle = ko.unwrap(options.startAngle) !== undefined ? ko.unwrap(options.startAngle) : 0;
        var endAngle = ko.unwrap(options.endAngle) !== undefined ? ko.unwrap(options.endAngle) : 360;

        var foregroundColor = ko.unwrap(options.foregroundColor) || '#000000';
        var backgroundColor = ko.unwrap(options.backgroundColor) || '#cccccc';
        var foregroundStrokeColor = ko.unwrap(options.foregroundStrokeColor) || '#555555';
        var backgroundStrokeColor = ko.unwrap(options.backgroundStrokeColor) || '#555555';
        var strokeWidth = ko.unwrap(options.strokeWidth) !== undefined ? ko.unwrap(options.strokeWidth) : true;

        var hideFirstTickLabel = ko.unwrap(options.hideFirstTickLabel) !== undefined ? ko.unwrap(options.hideFirstTickLabel) : false;
        var hideLastTickLabel = ko.unwrap(options.hideLastTickLabel) !== undefined ? ko.unwrap(options.hideLastTickLabel) : false;

        var canvas = d3.select(element)
            .append("svg")
            .attr("width", width + strokeWidth * 2)
            .attr("height", height + strokeWidth * 2)
            .append("g")
            .attr("transform", "translate(" + (width + strokeWidth) / 2 + "," + (height + strokeWidth) / 2 + ")");

        var arcBackground = d3.svg.arc()
            .innerRadius(radius - radius * (1 - innerRadius))
            .outerRadius(radius)
            .startAngle(startAngle * r2d)
            .endAngle(endAngle * r2d);

        var arcBackgroundElement = canvas
            .append("path")
            .attr("class", "arc-background")
            .style("fill", backgroundColor)
            .attr("stroke-width", strokeWidth)
            .attr("stroke", backgroundStrokeColor)
            .attr("d", arcBackground);

        var arcElement = canvas
            .append("path")
            .attr("class", "arc-foreground")
            .style("fill", foregroundColor)
            .attr("stroke-width", strokeWidth)
            .attr("stroke", foregroundStrokeColor);

        // Ticks and labels definitions
        var range = endAngle - startAngle;
        var scale = undefined;
        var ticks = undefined;
        var tickData = undefined;

        // a linear scale that maps domain values to a percent from 0..1
        scale = d3.scale.linear()
            .domain([minRange, maxRange])
            .range([0, 1]);

        // Generate ticks collection
        ticks = scale.ticks(majorTicks);

        var lineTicksConstainerClass = "line-ticks-container" +
            (hideFirstTickLabel ? " wf-hide-first-tick-label" : "") +
            (hideLastTickLabel ? " wf-hide-last-tick-label" : "");

        var arcTicks = canvas
            .append('g')
            .attr("class", lineTicksConstainerClass)
            .selectAll('.line-ticks')
            .data(ticks)
            .enter()
            .append('g')
            .attr("class", "line-ticks")
            .attr('transform',
                function (d) {
                    var ratio = scale(d);
                    var angle = startAngle + (ratio * range);
                    return 'rotate(' + angle + ') translate(0,' + (0 - radius) + ')';
                });


        if (showTickLines) {
            arcTicks.append('line')
                .attr("class", "wf-arc-ticks-line")
                .attr("x2", radius * (1 - innerRadius))
                .attr("x1", 0)
                .attr('transform', 'rotate(90)');
        }

        if (showTickLabels) {
            arcTicks.append('text')
                .attr("class", "wf-arc-ticks-label")
                .style("text-anchor", "middle")
                .text(labelFormat);
        }

    },

    update: function (element, valueAccessor, allBindingsAccessor) {
        var $element = $(element);
        var value = ko.unwrap(valueAccessor());
        var r2d = Math.PI / 180;

        var options = allBindingsAccessor().arcOptions || {};

        var width = ko.unwrap(options.width) !== undefined ? ko.unwrap(options.width) : 100;
        var height = ko.unwrap(options.height) !== undefined ? ko.unwrap(options.height) : 100;

        var paddings = ko.unwrap(options.paddings) || {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };

        var radius = Math.min(width - options.paddings.left - options.paddings.right, height - options.paddings.top - options.paddings.bottom) / 2;

        var innerRadius = ko.unwrap(options.innerRadius) !== undefined ? ko.unwrap(options.innerRadius) : 0.5;
        var startAngle = ko.unwrap(options.startAngle) !== undefined ? ko.unwrap(options.startAngle) : 0;
        var endAngle = ko.unwrap(options.endAngle) !== undefined ? ko.unwrap(options.endAngle) : 360;

        var animated = ko.unwrap(options.animated) !== undefined ? ko.unwrap(options.animated) : true;

        var animationDuration = 0;
        if (animated) {
            animationDuration = ko.unwrap(options.animationDuration) !== undefined ? ko.unwrap(options.animationDuration) : 500;
        }

        // Get the saved endAngle
        var prevValue = $element.data("prevValue") || value;

        var minRange = ko.unwrap(options.minRange) !== undefined ? ko.unwrap(options.minRange) : 0;
        var maxRange = ko.unwrap(options.maxRange) !== undefined ? ko.unwrap(options.maxRange) : 100;

        var majorTicks = ko.unwrap(options.majorTicks) !== undefined ? ko.unwrap(options.majorTicks) : 20;

        var showTickLines = ko.unwrap(options.showTickLines) !== undefined ? ko.unwrap(options.showTickLines) : true;
        var showTickLabels = ko.unwrap(options.showTickLabels) !== undefined ? ko.unwrap(options.showTickLabels) : false;
        var labelFormat = ko.unwrap(options.labelFormat) || d3.format(',g');
        
        var arc = d3.svg.arc()
            .innerRadius(radius - radius * (1 - innerRadius))
            .outerRadius(radius)
            .startAngle(startAngle * r2d);

        var arcElement = d3.select(element).select("path.arc-foreground");

        arcElement
            .transition()
            .ease("cubic-in-out")
            .duration(animationDuration)
            .attrTween("d",
                function () {
                    var tmpPrevValue = isNaN(prevValue) ? minRange : prevValue;
                    var tmpValue = isNaN(value) ? tmpPrevValue : value;

                    var start = {
                        startAngle: 0,
                        endAngle: tmpPrevValue * r2d
                    };
                    var end = {
                        startAngle: 0,
                        endAngle: tmpValue * r2d
                    };
                    var interpolate = d3.interpolate(start, end);
                    return function (t) {
                        return arc(interpolate(t));
                    };
                });

        // Ticks and labels definitions
        var range = endAngle - startAngle;
        var scale = undefined;
        var ticks = undefined;
        var tickData = undefined;

        // a linear scale that maps domain values to a percent from 0..1
        scale = d3.scale.linear()
            .domain([minRange, maxRange])
            .range([0, 1]);


        // Generate ticks collection
        ticks = scale.ticks(majorTicks);

        var arcTicks = d3.select(element)
            .select(".line-ticks-container")
            .selectAll('.line-ticks')
            .data(ticks);

        arcTicks
            .attr('transform',
                function(d) {
                    var ratio = scale(d);
                    var angle = startAngle + (ratio * range);
                    return 'rotate(' + angle + ') translate(0,' + (0 - radius) + ')';
                });

        if (showTickLines) {
            arcTicks.select('line')
                .attr("x2", radius * (1 - innerRadius));
        }

        if (showTickLabels) {
            arcTicks.select('text')
                .text(labelFormat);
        }

        var lineTicks = arcTicks.enter()
            .append('g')
            .attr("class", "line-ticks")
            .attr('transform',
                function(d) {
                    var ratio = scale(d);
                    var angle = startAngle + (ratio * range);
                    return 'rotate(' + angle + ') translate(0,' + (0 - radius) + ')';
                });


        if (showTickLines) {
            lineTicks
                .append('line')
                .attr("class", "wf-arc-ticks-line")
                .attr("x2", radius * (1 - innerRadius))
                .attr("x1", 0)
                .attr('transform', 'rotate(90)');
        }

        if (showTickLabels) {
            lineTicks
                .append('text')
                .attr("class", "wf-arc-ticks-label")
                .style("text-anchor", "middle")
                .text(labelFormat);
        }
        
        arcTicks.exit().remove();
        // Store the last current endAngle for next transition animation
        $(element).data("prevValue", value);
    }
};
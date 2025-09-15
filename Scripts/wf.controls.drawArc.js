// Example:  <div data-bind="drawArc: 'background-arc', arcOptions: { width: 200, height: 200, arcFillColor: '#880000', innerRadius: 0.975, startAngle: 0, endAngle: 325 }"></div>

ko.bindingHandlers.drawArc = {
    init: function (element, valueAccessor, allBindingsAccessor) {

        var value = valueAccessor();

        var options = allBindingsAccessor().arcOptions || {};
        var width = ko.unwrap(options.width) !== undefined ? ko.unwrap(options.width) : 100;
        var height = ko.unwrap(options.height) !== undefined ? ko.unwrap(options.height) : 100;
        var innerRadius = ko.unwrap(options.innerRadius) !== undefined ? ko.unwrap(options.innerRadius) : 0.5;

        var startAngle = ko.unwrap(options.startAngle) !== undefined ? ko.unwrap(options.startAngle) : 0;
        var endAngle = ko.unwrap(options.endAngle) !== undefined ? ko.unwrap(options.endAngle) : 360;
        var radius = Math.min(width, height) / 2;
        var arcFillColor = ko.unwrap(options.arcFillColor) || '#000000';

        var r2d = Math.PI / 180;

        var canvas = d3.select(element)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var arc = d3.svg.arc()
            .innerRadius(radius - radius * (1 - innerRadius))
            .outerRadius(radius)
            .startAngle(startAngle * r2d)
            .endAngle(startAngle * r2d);

        var arcElement = canvas
            .append("path")
            .style("fill", arcFillColor);

        var data = d3.range(20);
        var angle = d3.scale.ordinal().domain(data).rangeBands([0, 2 * Math.PI]);
    },

    update: function (element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor();

        var options = allBindingsAccessor().arcOptions || {};
        var width = ko.unwrap(options.width) !== undefined ? ko.unwrap(options.width) : 100;
        var height = ko.unwrap(options.height) !== undefined ? ko.unwrap(options.height) : 100;
        var innerRadius = ko.unwrap(options.innerRadius) !== undefined ? ko.unwrap(options.innerRadius) : 0.5;

        var startAngle = ko.unwrap(options.startAngle) !== undefined ? ko.unwrap(options.startAngle) : 0;
        var endAngle = ko.unwrap(options.endAngle) !== undefined ? ko.unwrap(options.endAngle) : 360;

        var radius = Math.min(width, height) / 2;
        var arcFillColor = ko.unwrap(options.arcFillColor) || '#000000';

        // Get the saved endAngle
        var prevValue = $(element).data('prevValue') || startAngle;

        var r2d = Math.PI / 180;
        var arc = d3.svg.arc()
            .innerRadius(radius - radius * (1 - innerRadius))
            .outerRadius(radius)
            .startAngle(startAngle * r2d);

        var arcElement = d3.select(element).select('path');

        arcElement
            .transition()
            .ease('cubic-in-out')
            .delay(500)
            .duration(500)
            .attrTween("d",
                function () {
                    var start = { startAngle: 0, endAngle: prevValue * r2d };
                    var end = { startAngle: 0, endAngle: endAngle * r2d };
                    var interpolate = d3.interpolate(start, end);
                    return function (t) {
                        return arc(interpolate(t));
                        //console.log(t);
                    };
                });

        // Store the last current endAngle for next transition animation
        $(element).data('prevValue', endAngle);

    }
};
//[Violation] Added non- passive event listener to a scroll- blocking 'touchstart' event.Consider marking event handler as 'passive' to make the page more responsive.See https://www.chromestatus.com/feature/5745543795965952
//to fix the above issue in the d3.js the line in the onAdd method needs to change (the custom npm d3 package needs to be created for this)
//old: this.addEventListener(type, this[name] = l, l.$ = capture);
//old: this.addEventListener(type, this[name] = l, {passive:true});

//plugin for hide/show y dynamically
c3.chart.fn.axis.show_y = function (shown) {
    var $$ = this.internal,
        config = $$.config;
    config.axis_y_show = !!shown;
    $$.axes.y.style("visibility", config.axis_y_show ? 'visible' : 'hidden');
    $$.redraw();
};

//plugin for hide/show y2 dynamically
c3.chart.fn.axis.show_y2 = function (shown) {
    var $$ = this.internal,
        config = $$.config;
    config.axis_y2_show = !!shown;
    $$.axes.y2.style("visibility", config.axis_y2_show ? 'visible' : 'hidden');
    $$.redraw();
};

ko.bindingHandlers.c3chart = {
    init: function (element, valueAccessor, allBindings) {
        var data = ko.unwrap(valueAccessor());

        var config = _.defaults({
            bindto: element,
            data: data,
            onresized: function () {
                setTimeout(function () {
                    chart.resize();
                },
                    300);
            }
        },
            allBindings());

        var chart = c3.generate(config);

        if (config.chartType) {
            chart._currentChartType = ko.unwrap(config.chartType);
        }

        ko.utils.domNodeDisposal.addDisposeCallback(element,
            function () {
                chart.destroy();
            });

        ko.utils.domData.set(element, "chart", chart);
        ko.utils.domData.set(element, "data", config.data);
    },

    update: function (element, valueAccessor, allBindings) {

        var chart = ko.utils.domData.get(element, 'chart');
        var oldData = ko.utils.domData.get(element, 'data');
        var data = ko.unwrap(valueAccessor());

        var chartType = ko.unwrap(allBindings.get('chartType'));
        var subChart = ko.unwrap(allBindings.get('subchart'));

        //#region find axises which should be unload

        //select new axises
        var newAxises = _.map(data.columns, function (item) {
            if (item.length > 0)
                return item[0];
        });
        //select new axises
        var oldAxises = _.map(oldData.columns, function (item) {
            if (item.length > 0)
                return item[0];
        });
        //if old axis no more, should be unload
        var unloadIds = _.filter(oldAxises, function (oldAxis) {
            return !_.contains(newAxises, oldAxis);
        });
        //#endregion

        if (JSON.stringify(data) !== JSON.stringify(oldData)) {
            chart.load({
                columns: data.columns,
                type: data.type,
                x: data.x,
                axes: data.axes,
                colors: data.colors,
                unload: unloadIds, //unload no existings axises. Should be option unload use. See c3 documentation
                types: data.types
            });

            if (data.xLines)
                chart.xgrids(data.xLines);

            if (data.yLines)
                chart.ygrids(data.yLines);

            if (data.xLabel)
                chart.axis.labels({
                    x: data.xLabel
                });

            if (data.yLabel)
                chart.axis.labels({
                    y: data.yLabel
                });

            if (data.y2Label)
                chart.axis.labels({
                    y2: data.y2Label
                });

            if (JSON.stringify(chart.axis.range()) !== JSON.stringify(data.range)) {
                // reseting axsis max is not workink without doing it explicit
                if (data.range.max != null && (data.range.max.y === undefined || data.range.max.y1 === undefined)) {
                    chart.axis.max(undefined);
                }
                // reseting axsis min is not workink without doing it explicit
                if (data.range.min != null && (data.range.min.y === undefined || data.range.min.y1 === undefined)) {
                    chart.axis.min(undefined);
                }

                chart.axis.range(data.range);
            }

            if (JSON.stringify(chart.axis.labels()) !== JSON.stringify(data.axisLabels))
                chart.axis.labels(data.axisLabels);

            if (JSON.stringify(chart.data.names()) !== JSON.stringify(data.names))
                chart.data.names(data.names);

            chart.axis.show_y(data.showY);
            chart.axis.show_y2(data.showY2);

            //#region update colors on sub chart. c3 do not this automaticaly.
            if (subChart && subChart.show) {
                for (var i = 1; i < data.columns.length; i++) { //i=0 this is 'x'

                    var columnName = data.columns[i][0].replace(/(:|\.|\[|\]|,|=|@|\/|_|[ ])/g, "-");

                    var lines = $(element).find('.c3-line-' + columnName);

                    $(lines[1]).css("stroke", $(lines[0]).css("stroke"));
                }
            }
            //#endregion

            //neu chart.hide() - API des Charts: verstecken der Linien im Init-Modus amueller 1.07.2020
            if (data.hide) {
                chart.hide(data.hide);
            }
        }

        if (chartType && chart._currentChartType !== chartType) {
            chart.transform(chartType);
            chart._currentChartType = chartType;
            ko.utils.domData.set(element, "chart", chart);
        }

        ko.utils.domData.set(element, "data", data);
    }
};
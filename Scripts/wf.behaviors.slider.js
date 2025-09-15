// KO Binding handler for Bootstrap Slider plugin
// http://seiyria.com/bootstrap-slider/
// Binding handler is a forked from https://github.com/cosminstefanxp/bootstrap-slider-knockout-binding


ko.bindingHandlers.sliderValue = {
    init: function (element, valueAccessor) {
        var params = ko.utils.unwrapObservable(valueAccessor());


        // Check whether the value observable is either placed directly or in the paramaters object.
        if (!(ko.isObservable(params) || params['value']))
            throw "You need to define an observable value for the sliderValue. Either pass the observable directly or as the 'value' field in the parameters.";

        // Identify the value and initialize the slider
        var valueObservable;
        if (ko.isObservable(params)) {
            valueObservable = params;
            $(element).slider({
                value: ko.unwrap(params)
            });
        } else {
            valueObservable = params['value'];
            if (!Array.isArray(valueObservable)) {
                // Replace the 'value' field in the options object with the actual value
                params['value'] = ko.unwrap(valueObservable);
                $(element).slider(params);
            } else {
                valueObservable = [params['value'][0], params['value'][1]];
                params['value'][0] = ko.unwrap(valueObservable[0]);
                params['value'][1] = ko.unwrap(valueObservable[1]);
                $(element).slider(params);
            }
        }


        // Make sure we update the observable when changing the slider value
        $(element).on('change', function (ev) {
            ev.preventDefault();
            if (!Array.isArray(valueObservable)) {
                valueObservable(ev.value.newValue);
            } else {
                valueObservable[0](ev.value.newValue[0]);
                valueObservable[1](ev.value.newValue[1]);
            }
        }).on('slideStop', function (ev) {
            ev.preventDefault();
        });

        $(window).resize(function () {
            $(element).slider('relayout');
        });

        $(element).slider({
            formatter: function (num) {
                var stringFormat = ko.unwrap(params.format);
                var tooltipString = null;
                var showUnit = ko.unwrap(params.unitLabel);
                var unit = ko.unwrap(params.unit);

                var currentValue = ko.unwrap(params.committedValue);
                var newValue = numeral(num).format(stringFormat);

                // Show new value in the tooltip text only if it is different to the current value
                if (currentValue !== newValue) {
                    tooltipString = currentValue + " ➤ " + newValue;
                }
                if (currentValue === newValue) {
                    tooltipString = currentValue;
                }

                // Show signal unit in the tooltip text if configured
                if (showUnit) {
                    tooltipString = tooltipString + " " + unit;
                }

                return tooltipString;
            }
        });

        //workaround to print lables correctly if slider is placed in tabs
        $('a[data-toggle=tab]').each(function () {
            var $this = $(this);
            $this.on('shown.bs.tab', function () {
                $(element).slider('relayout');
            });
        });

        //workaround to print lables correctly if slider is placed in modal
        $('.modal').each(function () {
            var $this = $(this);
            $this.on('shown.bs.modal', function () {
                $(element).slider('relayout');
            });
        });

        //destroy all events
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).off('change');
            $(element).off('slideStop');
            $(window).off("resize");

            $('a[data-toggle=tab]').each(function () {
                var $this = $(this);
                $this.off('shown.bs.tab');
            });

            $('.modal').each(function () {
                var $this = $(this);
                $this.off('shown.bs.modal');
            });
            $(element).slider("destroy");
        });

    },
    update: function (element, valueAccessor) {
        var modelValue = valueAccessor();

        var valueObservable;
        if (ko.isObservable(modelValue)) {
            valueObservable = modelValue;
        } else {
            valueObservable = modelValue['value'];
            //$(element).slider('refresh');
        }

        if (!Array.isArray(valueObservable)) {
            $(element).slider('setValue', parseFloat(valueObservable()));
        } else {
            $(element).slider('setValue', [parseFloat(valueObservable[0]()), parseFloat(valueObservable[1]())]);
        }

        var enable = ko.unwrap(modelValue['enabled']) !== undefined ? ko.unwrap(modelValue['enabled']) : true;
        enable ? $(element).slider('enable') : $(element).slider('disable');

        var checkExist = setInterval(function () {
            if ($(element).width() !== 0) {
                $(element).slider('relayout');
                clearInterval(checkExist);
            }
        }, 500);
    }
};
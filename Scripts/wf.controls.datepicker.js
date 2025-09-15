// Knockout binding handler for Bootstrap date time picker
ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        var options = allBindingsAccessor().datepickerOptions || {};

        options.icons = {
            time: 'wf wf-clock',
            date: 'wf wf-calendar',
            up: 'wf wf-arrow-metro-o wf-n',
            down: 'wf wf-arrow-metro-o wf-s',
            previous: 'wf wf-arrow-metro wf-w',
            next: 'wf wf-arrow-metro',
            today: 'wf wf-callout-o',
            clear: 'wf wf-clear',
            close: 'wf wf-close-round-o'
        };

        //options.debug = true; //keeps the datepicker opened

        if (options.maxDate && options.maxDate !== null) {
            options.maxDate = ko.unwrap(options.maxDate);
        }
        if (options.minDate && options.minDate !== null) {
            options.minDate = ko.unwrap(options.minDate);
        }

        //options.widgetPositioning = {
        //    horizontal: "auto",
        //    vertical: "bottom"
        //};
        delete options.widgetClass;
        $(element).datetimepicker(options);

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).data("DateTimePicker").destroy();
            $(element).off("dp.change");
        });

        if (allBindingsAccessor().isOptional) {
            var optionalButton = $("<span id='disableElement' class='input-group-addon red'><span class= 'fa fa-close'></span></span>");

            optionalButton.on("click",
                function () {
                    var invalidateDate = valueAccessor()();
                    if (invalidateDate) {
                        //$(element).children(":not(#disableElement)").toggleClass("disabled");
                        //optionalButton.toggleClass("red");

                        valueAccessor()(null);
                    }
                });

            optionalButton.appendTo($(element));
        }
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor();

        if (ko.unwrap(value) === undefined)
            value = null;

        var options = allBindingsAccessor().datepickerOptions || {};

        // $(element).data("DateTimePicker").maxDate(ko.unwrap(options.maxDate));
        // $(element).data("DateTimePicker").minDate(ko.unwrap(options.minDate));

        var pickerWidgetClass = options.widgetClass;
        delete options.widgetClass;

        $(element).off("dp.change");

        $(element).data("DateTimePicker").date(ko.unwrap(value));
        if (options.format)
            $(element).data("DateTimePicker").format(ko.unwrap(options.format));
        if (options.viewMode)
            $(element).data("DateTimePicker").viewMode(ko.unwrap(options.viewMode));
        if (options.calendarWeeks)
            $(element).data("DateTimePicker").calendarWeeks(ko.unwrap(options.calendarWeeks));
        
        $(element)
            .on("dp.show",
                function (event) {
                    var weeksMode = $(element).data("DateTimePicker").calendarWeeks();
                    weeksMode
                        ? $(".datepicker-days").addClass(pickerWidgetClass)
                        : $(".datepicker-days").removeClass(pickerWidgetClass);
                });

        $(element)
            .on("dp.change",
                function (event) {
                    var date = $(element).data("DateTimePicker").date();//.toDate();
                    var value = valueAccessor();

                    if (ko.isObservable(value)) {
                        value(date);
                    }
                });

    }
};
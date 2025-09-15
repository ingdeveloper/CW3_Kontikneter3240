
var _this = this;
String.prototype.format = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return this.replace(/{(\d+)}/g, function (match, placeholder) { return (typeof args[placeholder] != 'undefined' ? args[placeholder] : match); });
};
// Pad a string with defined characters to a certain length 
// For example: var str = "5";
// alert(str.lpad("0", 4)); //result "0005"
String.prototype.lpad = function (padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
};
String.prototype.stringPlaceholderResolver = function (OIDvalue, replaceAsLocalObjectId) {
    if (replaceAsLocalObjectId === void 0) { replaceAsLocalObjectId = true; }
    var str = ko.unwrap(this);
    if (str === undefined || str === null)
        str = "";
    if (ko.unwrap(OIDvalue)) {
        str = str.split('[OID]').join(ko.unwrap(OIDvalue));
        if (replaceAsLocalObjectId) {
            str = str.split('[LocalOID]').join(ko.unwrap(OIDvalue));
        }
    }
    return str.valueOf();
};
String.prototype.extractI4SignalDeclaration = function () {
    var deviceName = "";
    var signalName = "";
    var name = ko.unwrap(_this);
    if (name) {
        var indexOfSeparator = name.indexOf("->");
        if (indexOfSeparator === -1) {
            signalName = name;
        }
        else {
            deviceName = name.substring(0, indexOfSeparator);
            signalName = name.substring(indexOfSeparator + 2);
        }
    }
    return {
        signalName: signalName,
        deviceName: deviceName
    };
};
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (search, pos) {
        return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    };
}
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (search, this_len) {
        if (this_len === undefined || this_len > this.length) {
            this_len = this.length;
        }
        return this.substring(this_len - search.length, this_len) === search;
    };
}
//# sourceMappingURL=wf.extensions.string.js.map


// setup knockout plugins
ko.punches.enableAll();
ko.punches.interpolationMarkup.enable();
ko.punches.attributeInterpolationMarkup.enable();

ko.filters.numberFormat = function(value, format) {
    var unwrappedValue = ko.unwrap(value);
    return numeral(unwrappedValue).format(format);
};
ko.filters.dynamicNumberFormat = function(value) {
    var unwrappedValue = ko.unwrap(value);
    var format;
    var absValue = Math.abs(unwrappedValue);

    if (absValue === 0) {
        return "0";
    }
    else if (absValue < 0.0001 && absValue > 0) {
        return unwrappedValue.toExponential();
    } else if (absValue < 0.001) {
        format = "0,0.00000";
    } else if (absValue < 0.01) {
        format = "0,0.0000";
    } else if (absValue < 1) {
        format = "0,0.000";
    } else if (absValue < 100) {
        format = "0,0.00";
    } else {
        format = "0,0";
    }

    return numeral(unwrappedValue).format(format);
};
ko.filters.percentageFormat = function(value) {
    var unwrappedValue = ko.unwrap(value);
    return numeral(unwrappedValue).format("0.00%");
};
ko.filters.dateFormat = function(value, format) {
    var unwrappedValue = ko.unwrap(value);

    return moment(unwrappedValue).format(format);
};


//Based on Knockstrap https://github.com/faulknercs/Knockstrap
ko.utils.uniqueId = (function () {

    var prefixesCounts = {
        'ks-unique-': 0
    };

    return function (prefix) {
        prefix = prefix || 'ks-unique-';

        if (!prefixesCounts[prefix]) {
            prefixesCounts[prefix] = 0;
        }

        return prefix + prefixesCounts[prefix]++;
    };
})();


//Based on Knockstrap https://github.com/faulknercs/Knockstrap
ko.utils.unwrapProperties = function (wrappedProperies) {

    if (wrappedProperies === null || typeof wrappedProperies !== 'object') {
        return wrappedProperies;
    }

    var options = {};

    ko.utils.objectForEach(wrappedProperies, function (propertyName, propertyValue) {
        options[propertyName] = ko.unwrap(propertyValue);
    });

    return options;
};


// Closure
(function () {

    /**
	 * Decimal adjustment of a number.
	 *
	 * @param	{String}	type	The type of adjustment.
	 * @param	{Number}	value	The number.
	 * @param	{Integer}	exp		The exponent (the 10 logarithm of the adjustment base).
	 * @returns	{Number}			The adjusted value.
	 */
    function decimalAdjust(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Decimal round
    if (!Math.round10) {
        Math.round10 = function (value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
    // Decimal floor
    if (!Math.floor10) {
        Math.floor10 = function (value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
    // Decimal ceil
    if (!Math.ceil10) {
        Math.ceil10 = function (value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }

})();


(function(moment) {

    moment.fn.forceUTC = function() {
        return this.add(this.utcOffset(), "minutes");
    };
    moment.fn.toUTCISOString = function() {
        var array = this.toArray();

        return moment.utc(array).toISOString();
    };
})(moment);


if (typeof (isNullOrUndefined) === "undefined") {
    isNullOrUndefined = function (obj) {
        if (obj === undefined || obj === null) {
            return true;
        }
        return false;
    };
}
if (typeof (evaluateCondition) === "undefined") {
    evaluateCondition = function (param1, param2, operator) {
        switch (operator) {
            case "==":
                return param1 == param2;
            case "!=":
                return param1 != param2;
            case "<":
                return param1 < param2;
            case ">":
                return param1 > param2;
            case "<=":
                return param1 <= param2;
            case ">=":
                return param1 >= param2;
            default:
                return false;
        }
    };
}
//# sourceMappingURL=wf.extensions.js.map


ko.bindingHandlers.setZIndexOnMouseOver = {
    init: function (element, valueAccessor, allBindings) {

        var data = ko.unwrap(valueAccessor());
        var newIndex = ko.unwrap(data.zIndex)|| 10000;
        var applyParentZIndex = ko.unwrap(data.applyParentZIndex) !== undefined ? ko.unwrap(data.applyParentZIndex) : true;

        var currentIndex = $(element).css("z-index") || '';
        var parentCurrentIndex = $(element).parent().css("z-index") || '';

        ko.utils.domData.set(element, "newIndex", newIndex);
        ko.utils.domData.set(element, "currentIndex", currentIndex);
        ko.utils.domData.set(element, "parentCurrentIndex", parentCurrentIndex);
        ko.utils.domData.set(element, "applyParentZIndex", applyParentZIndex);

        $(element).mouseover(function () {
            var index = ko.utils.domData.get(element, 'newIndex');
            var withParent = ko.utils.domData.get(element, 'applyParentZIndex');

            $(this).css("z-index", index);
            if (withParent)
                $(this).parent().css("z-index", index);
        });

        $(element).mouseout(function () {
            var elementIndex = ko.utils.domData.get(element, 'currentIndex');
            var parentIndex = ko.utils.domData.get(element, 'parentCurrentIndex');
            var withParent = ko.utils.domData.get(element, 'applyParentZIndex');

            $(this).css("z-index", elementIndex);
            if (withParent)
                $(this).parent().css("z-index", parentIndex);
        });
    },

    update: function (element, valueAccessor, allBindings) {

        var data = ko.unwrap(valueAccessor());
        var newIndex = ko.unwrap(data.zIndex) || 10000;
        var applyParentZIndex = ko.unwrap(data.applyParentZIndex) !== undefined ? ko.unwrap(data.applyParentZIndex) : true;

        var currentIndex = $(element).css("z-index") || '';
        var parentCurrentIndex = $(element).parent().css("z-index") || '';

        ko.utils.domData.set(element, "newIndex", newIndex);
        ko.utils.domData.set(element, "currentIndex", currentIndex);
        ko.utils.domData.set(element, "parentCurrentIndex", parentCurrentIndex);
        ko.utils.domData.set(element, "applyParentZIndex", applyParentZIndex);
    }
};


//Based on Knockstrap https://github.com/faulknercs/Knockstrap

var popoverDomDataTemplateKey = '__popoverTemplateKey__';

ko.bindingHandlers.bsPopover = {

    init: function (element, valueAccessor, allBindingsAccessor) {
        var $element = $(element),
            value = ko.unwrap(valueAccessor()),
            options = (!value.options && !value.template ? ko.utils.unwrapProperties(value) : ko.utils.unwrapProperties(value.options)) || {};

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            if ($element.data('bs.popover')) {
                $element.popover('destroy');
            }
        });

        $(element)
            .click(function () {
                var btn = this;

                if (options.singleMode)
                    $('[data-original-title]').each(function () {
                        if (this === btn) return; //close all except clicked. Clicked button will toggle
                        (($(this).popover('hide').data('bs.popover') || {}).inState || {})
                        .click = false; // Without open again with 2 click
                    });

                $(btn).popover('toggle');
            });

        $(element).attr("data-original-title", ko.unwrap(options.title));

        $(element).on("mouseover",
            function () {
                if (options.trigger && options.trigger.indexOf("hover") > -1) {
                    $element.popover("show");
                }
            });

        if (options.singleMode)
            $('body')
            .on('click', function (e) {
                if (!$(element).is(e.target) && $(element).has(e.target).length === 0 && $('.popover').has(e.target).length === 0)
                    (($(element).popover('hide').data('bs.popover') || {}).inState || {}).click = false;
            });
    },

    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $element = $(element),
            value = ko.unwrap(valueAccessor()),
            options = (!value.options && !value.template ? ko.utils.unwrapProperties(value) : ko.utils.unwrapProperties(value.options)) || {},
            closeButton = options.closeButton !== undefined ? options.closeButton : true;

        options.closeButtonCssClass = options.closeButtonCssClass || "close";

        if (value.template) {
            // use unwrap to track dependency from template, if it is observable
            ko.unwrap(value.template);

            var id = ko.utils.domData.get(element, popoverDomDataTemplateKey),
                data = ko.unwrap(value.data);

            var renderPopoverTemplate = function () {
                // use unwrap again to get correct template value instead of old value from closure
                // this works for observable template property
                ko.renderTemplate(ko.unwrap(value.template), bindingContext.createChildContext(data, null, function (context) {
                    ko.utils.extend(context, viewModel);
                    ko.utils.extend(context.__proto__, viewModel.__proto__);
                }), value.templateOptions, document.getElementById(id));

                // bootstrap's popover calculates position before template renders,
                // so we recalculate position, using bootstrap methods
                var $popover = $('#' + id).parents('.popover'),
                    popoverMethods = $element.data('bs.popover');

                var popoverContent = $popover.find('.popover-content');
                if (options.width) {
                    popoverContent.width(options.width);
                    popoverContent.css("max-width", options.width + "px");
                }

                if (options.height) {
                    popoverContent.height(options.height);
                    popoverContent.css("max-height", options.height + "px");
                }
                if (options.headerCssClass)
                    $popover.find('.popover-title').addClass(options.headerCssClass);

                if (options.contentCssClass)
                    $popover.find('.popover-content').addClass(options.contentCssClass);

                if (closeButton)
                    $popover.find('.popover-title').append('<button class="' + options.closeButtonCssClass + '" type="button" data-dismiss="popover">x</button>');

                var offset = popoverMethods.getCalculatedOffset(options.placement || 'right', popoverMethods.getPosition(), $popover.outerWidth(), $popover.outerHeight());
                popoverMethods.applyPlacement(offset, options.placement || 'right');

                var checkExist = setInterval(function () {
                    var div = $('#' + id);
                    if (div.height() !== 0 && div.width() !== 0) {
                        var offset = popoverMethods.getCalculatedOffset(options.placement || 'right', popoverMethods.getPosition(), $popover.outerWidth(), $popover.outerHeight());
                        popoverMethods.applyPlacement(offset, options.placement || 'right');

                        clearInterval(checkExist);
                    }
                }, 50);
            };

            // if there is no generated id - popover executes first time for this element
            if (!id) {
                id = ko.utils.uniqueId('ks-popover-');
                //id = "ks-popover-" + (++ko.bindingHandlers.popover.counter);

                ko.utils.domData.set(element, popoverDomDataTemplateKey, id);

                // place template rendering after popover is shown, because we don't have root element for template before that
                $element.on('shown.bs.popover', renderPopoverTemplate);
            }

            options.content = '<div id="' + id + '" ></div>';
            options.html = true;
            options.trigger = options.trigger !== undefined ? options.trigger : 'manual';
            // support rerendering of template, if observable changes, when popover is opened
            if ($('#' + id).is(':visible')) {
                renderPopoverTemplate();
            }
        }

        var popoverData = $element.data('bs.popover');

        if (!popoverData) {
            $element.popover(options);

            $element.on('shown.bs.popover', function () {
                (options.container ? $(options.container) : $element.parent()).one('click', '[data-dismiss="popover"]', function () {
                    (($($element).popover('hide').data('bs.popover') || {}).inState || {}).click = false; // Without open again with 2 click
                });
            });
        } else {
            ko.utils.extend(popoverData.options, options);
        }
    }
};


ko.bindingHandlers.modalDialog = {
    init: function (element, valueAccessor) {

        var properties = valueAccessor();

        if (!properties) return;

        var appendToBody = properties.appendToBody !== undefined ? ko.unwrap(properties.appendToBody) : true;
        var draggable = properties.draggable !== undefined ? ko.unwrap(properties.draggable) : true;
        var draggableHandle = properties.draggableHandle !== undefined ? ko.unwrap(properties.draggableHandle) : ".modal-header";

        if (appendToBody)
            $(element).appendTo("body");
        
        if (draggable)
            $(element).draggable({
                    showCoordinates: false,
                    showTooltip: false,
                    handle: draggableHandle
                });

        $(element).modal({
                show: false
            });

        if (typeof properties.show === 'function') {
            $(element).on('hide.bs.modal', function () {
                properties.show(false);
            });
        }

        
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).data('bs.modal', null).remove();
        });
    },

    update: function (element, valueAccessor) {
        var value = valueAccessor();
        var show = value.show !== undefined ? value.show : value();

        if (ko.utils.unwrapObservable(show)) {
            $(element).modal('show');
        } else {
            $(element).modal('hide');
        }
    }
}


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


/**
 * Load content dinamically when scroll go to end
 * @param {function()} endScrollCallback - null. Callback function, which will be call when need load data dinamicaly
 * @param {string} selectorOfInnerWithoutScrollObject - ''. JQuery selector of content, where have to load content dynamically
 * eg.
 * <div class="wrapperWithScrollbar" data-bind="infiniteScroll: { endScrollCallback: function() { getNewChunk(); }, selectorOfInnerWithoutScrollObject: '.contentContainer'">
 *     <div class='contentContainer'>
 *          ...
 *     <div/>
 * </div>
 */
ko.bindingHandlers.infiniteScroll = {
    update: function (element, valueAccessor) {
        var options = valueAccessor();
        var callback = options.endScrollCallback || null;
        var selectorOfInnerWithoutScrollObject = options.selectorOfInnerWithoutScrollObject || null;

        $(element).off("scroll");
        
        if (selectorOfInnerWithoutScrollObject) {
            $(element).on("scroll", function () {
                if ($(element).outerHeight() + $(element).scrollTop() + 1 >= $(element).find(selectorOfInnerWithoutScrollObject).height() && callback)
                    callback();
            });
        } else {
            $(window).on("scroll", function () {
                if (document.body.scrollTop + window.innerHeight + 1 >= $(element).height() + $(element).offset().top && callback)
                    callback();
            });
        }
    }
};


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


// Knockout binding handler Bootstrap Progress
// Source: https://github.com/billpull/knockout-bootstrap

ko.bindingHandlers.progress = {
    counter: 0,
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $element = $(element);
        var cssClass = allBindingsAccessor().cssClass || "";
        var orientation = allBindingsAccessor().orientation || "horizontal";
        
        var guid = "__pb__" + (++ko.bindingHandlers.progress.counter);

        var bar = $('<div/>',
            {
                'class': "progress-bar wf-progress-state",
                'data-bind': "css:" + cssClass + ", " +
                "style: { " + (orientation.indexOf("vertical") > -1 ? "height" : "width") + ": " + valueAccessor() + "}"
            });

        $element.attr('id', guid)
            .addClass('progress')
            .append(bar);
    }
};


// Knockout binding handler for Bootstrap Radio Buttons
// Based on: http://www.ewal.net/2012/10/17/bootstrap-knockout-toggle-button-bindings/

ko.bindingHandlers.checkbox = {
    init: function (element, valueAccessor, allBindings, data, context) {
        var observable = valueAccessor();
        if (!ko.isWriteableObservable(observable)) {
            throw "You must pass an observable or writeable computed";
        }
        var $element = $(element);
        $element.on("click",
            function () {
                observable(!observable());
            });
        ko.computed({
            disposeWhenNodeIsRemoved: element,
            read: function () {
                $element.toggleClass("active", observable());
            }
        });
    }
};


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


/**
 * Bingind handler for an SVG arc path, without any dependencies for other libraries
 * 
 * @param {string} pathClass = "wf-svg-path";
 * @param {string} svgClass =  "wf-svg-container";
 * @param {number} size = 100
 * @param {number} strokeWidth = 0;
 * @param {number} innerRadius = 25;
 * @param {number} outerRadius = (size - strokeWidth) / 2;
 * @param {number} startAngle = 0;
 * @param {number} endAngle = 90;
 *  
 * **/

function createArcPath(startAngle, endAngle, outerRadius, innerRadius) {
    var unit = (Math.PI * 2) / 360;
    
    var sinAlpha = Math.sin(startAngle * unit);
    var cosAlpha = Math.cos(startAngle * unit);
    var sinBeta = Math.sin(endAngle * unit);
    var cosBeta = Math.cos(endAngle * unit);
  
    var largeArc = (endAngle - startAngle) * unit > Math.PI;
  
    // Calculate coordinates for points P,Q,R,S which define the arc path
    var P = {
      x: outerRadius + (outerRadius * sinAlpha),
      y: outerRadius - (outerRadius * cosAlpha)
    };
  
    var Q = {
      x: outerRadius + (outerRadius * sinBeta),
      y: outerRadius - (outerRadius * cosBeta)
    };
  
    var R = {
      x: outerRadius + (innerRadius * sinBeta),
      y: outerRadius - (innerRadius * cosBeta)
    };
  
    var S = {
      x: outerRadius + (innerRadius * sinAlpha),
      y: outerRadius - (innerRadius * cosAlpha)
    }
  
    return 'M' + P.x + ',' + P.y + ' A' + outerRadius + ',' + outerRadius + ' 0 ' + (largeArc ? '1,1' : '0,1') + ' ' + Q.x + ',' + Q.y + ' L' + R.x + ',' + R.y + ' A' + innerRadius + ',' + innerRadius + ' 0 ' + (largeArc ? '1,0' : '0,0') + ' ' + S.x + ',' + S.y + ' Z';
  }
  
function createSVG(size, strokeWidth,svgClass) {
    
    var svgns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgns, "svg");
    
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("class", svgClass +" overflow-visible");
    svg.setAttribute("viewBox", -strokeWidth/2 + " " + -strokeWidth/2 + " " + size + " " + size);
  
    return svg;
  }
  
  function createPath(strokeWidth, pathClass) {
    var svgns = "http://www.w3.org/2000/svg";
    var path = document.createElementNS(svgns, "path");
    path.setAttribute("class", pathClass);
    path.setAttribute("stroke-width", strokeWidth);
    path.setAttribute("fill", "#eeeeee");
    path.setAttribute("stroke", "#555555");
    return path;
  }


ko.bindingHandlers.svgArc = {
    
    init: function (element, valueAccessor) {
        var options = valueAccessor();
        var element = element;

        var pathClass = options.pathClass || "wf-svg-path";
        var svgClass = options.svgClass || "wf-svg-container";
        var size = options.size || 100
        var strokeWidth = options.strokeWidth || 0;
        var innerRadius = options.innerRadius || 25;
        var outerRadius = options.outerRadius || (size - strokeWidth) / 2;

        var startAngle = options.startAngle || 0;
        var endAngle = options.endAngle || 90;

        var svg = createSVG(size, strokeWidth, svgClass);
        var path = createPath(strokeWidth, pathClass);

        path.setAttribute("d", createArcPath(startAngle, endAngle, outerRadius, innerRadius));
        svg.appendChild(path);

        element.appendChild(svg);

    }
}


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


/**
 * Bingind handler for jQuery smartJQueryZoom - https://github.com/e-smartdev/smartJQueryZoom
 * @param {number} maxScale - '3' max scale to zoom in
 * @param {number} minScale - '0.5' min scale to zoom out
 * @param {number} initScale - 1, initial scale to zoom
 * @param {number} top - '0' zoom target container top position in pixel
 * @param {number} left - '0' zoom target container left position in pixel
 * @param {Object} initPosition - add coordinates to current position by init or reset. e.g. {x: 100, y: 250}
 * @param {string} width - '100%' zoom target container width in pixel or in percent
 * @param {string} height - '100%' zoom target container height in pixel or in percent 
 * @param {Object} initCallback -  null a callback function to call after plugin initilization
 * @param {string} easing - 'smartZoomEasing' jquery easing function used when the browser doesn't support css transitions
 * @param {boolean} border - false the container have a border to limit the actions with the content inside
 * @param {boolean} mouseEnabled - true enable plugin mouse interaction 
 * @param {boolean} mouseMoveEnabled - true enable plugin target drag behviour
 * @param {boolean} moveCursorEnabled - true show moveCursor for drag
 * @param {boolean} touchEnabled - true enable plugin touch interaction 
 * @param {boolean} touchMoveEnabled - true enable target move via touch
 * @param {boolean} adjustOnResize - true positioning and scale the content in the center of the container on resize
 * @param {boolean} dblClickMaxScale - true enable plugin double tap behaviour
 * @param {boolean} scrollEnabled -  true enable plugin mouse wheel behviour
 * @param {number} mouseWheelDeltaFactor - 0.15 set the scroll speed
 * @param {boolean} zoomOnSimpleClick - true enable plugin one click zoom behaviour
 * @param {boolean} pinchEnabled - true enable zoom when user pinch on target
 * @param {string} containerClass - '' class to apply to zoom target container if you whant to change background or borders (don't change size or position via the class)
 * @param {string} containerBackground - 'transparent' zoom target container background color (if containerClass is not set)
 * @param {boolean} transition - false enable or disable the transision effect on the content
 * @param {boolean} controlBar - true show the controlBar or hidde it
 * @param {string} controlsBarClass - 'wf-zoom-controlbar btn-group right-top' Class for the html element for the controlBar
 * @param {string} zoomInButtonClass - 'btn btn-variant-dark' Class for the html elment zoomInButton
 * @param {string} zoomInButtonIconClass - 'wf wf-add-round' Class for the html elment icon in the zoomInButton div
 * @param {string} zoomOutButtonClass - 'btn btn-variant-dark' Class for the html elment zoomOutButton
 * @param {string} zoomOutButtonIconClass - 'wf wf-remove-round' Class for the html elment icon in the zoomOutButton div
 * @param {string} resetButtonClass - 'btn btn-variant-dark' Class for the html elment resetButton
 * @param {string} resetButtonIconClass - 'wf wf-arrow-refresh-left' Class for the html elment icon in the resetButton div
 * @param {boolean} panControlBar - false show the controlBar or hidde it
 * @param {string} panControlsBarClass - 'wf-pan-controlbar right-bottom' Class for the html element for the pan controls bar
 * @param {number} pixelsToMoveOnPan - 100 pixels to move on pan
 * @param {string} panLeftButtonClass - 'btn btn-variant-dark' Class for the html elment icon in the leftButton div
 * @param {string} panLeftButtonIconClass - 'wf wf-arrow-refresh-left' Class for the html elment icon in the leftButton div
 * @param {string} panRightButtonClass - 'btn btn-variant-dark' Class for the html elment icon in the rightButton div
 * @param {string} panRightButtonIconClass - 'wf wf-arrow-refresh-right' Class for the html elment icon in the rightButton div
 * @param {string} panUpButtonClass - 'btn btn-variant-dark' Class for the html elment icon in the upButton div
 * @param {string} panUpButtonIconClass - 'wf wf-arrow-refresh-uo' Class for the html elment icon in the upButton div
 * @param {string} panDownButtonClass - 'btn btn-variant-dark' Class for the html elment icon in the downButton div
 * @param {string} panDownButtonIconClass - 'wf wf-arrow-refresh-down' Class for the html elment icon in the downButton div
 * @param {function} currentScale - if param is observable, will be set current scale
 */

// Example: <div data-bind="esmartzoom: { }">....</div>
// Known Bugs
//- Firefox 52: Hybrid(allinone) devices dont detect touch event
//- Edge need property about:flags touch enable for touch devices

ko.bindingHandlers.esmartzoom = {
        init: function (element, valueAccessor) {
            var $element = $(element);
            var currentScale = valueAccessor().currentScale;

            $(element).bind("scaleChanged",
                function (event, scale) {
                    if (currentScale && typeof currentScale === "function")
                        currentScale(scale);
                });

            ko.utils.domNodeDisposal.addDisposeCallback(element,
                function () {
                    $element.smartZoom("destroy");
                });
        },

        update: function (element, valueAccessor) {
            var $element = $(element);
            var $parent = $element.parent();
            var options = ko.unwrap(valueAccessor()) || {};

            // OPTIONS

            var maxScale = ko.unwrap(options.maxScale) || 3;
            var minScale = ko.unwrap(options.minScale) || 0.5;
            var initPosition = ko.unwrap(options.initPosition);
            var initScale = ko.unwrap(options.initScale);
            if (initScale != undefined && initScale < minScale)
                initScale = minScale;
            var top = ko.unwrap(options.top) || "0"; // only % or px
            var left = ko.unwrap(options.left) || "0"; // only % or px
            var width = ko.unwrap(options.width) || "100%"; // only % or px
            var height = ko.unwrap(options.height) || "100%"; // only % or px
            var initCallback = ko.unwrap(options.initCallback) || null;
            var easing = ko.unwrap(options.easing) || "smartZoomEasing";
            var border = ko.unwrap(options.border) !== undefined ? ko.unwrap(options.border) : false;

            //#region Mouse events
            var mouseEnabled = ko.unwrap(options.mouseEnabled) !== undefined ? ko.unwrap(options.mouseEnabled) : true;
            var mouseMoveEnabled = ko.unwrap(options.mouseMoveEnabled) !== undefined
                                       ? ko.unwrap(options.mouseMoveEnabled)
                                       : true;
            var moveCursorEnabled = ko.unwrap(options.moveCursorEnabled) !== undefined
                                        ? ko.unwrap(options.moveCursorEnabled)
                                        : true;
            //#endregion

            //touch 
            var touchEnabled = ko.unwrap(options.touchEnabled) !== undefined ? ko.unwrap(options.touchEnabled) : true;
            var touchMoveEnabled = ko.unwrap(options.touchMoveEnabled) !== undefined
                                       ? ko.unwrap(options.touchMoveEnabled)
                                       : true;
            //touch END

            //other options
            var adjustOnResize = ko.unwrap(options.adjustOnResize) !== undefined ? ko.unwrap(options.adjustOnResize) : true;
            var dblClickMaxScale = ko.unwrap(options.dblClickMaxScale) !== undefined
                                       ? ko.unwrap(options.dblClickMaxScale)
                                       : 1.8;
            var zoomOnSimpleClick = ko.unwrap(options.zoomOnSimpleClick) !== undefined
                                        ? ko.unwrap(options.zoomOnSimpleClick)
                                        : false;
            var scrollEnabled = ko.unwrap(options.scrollEnabled) !== undefined ? ko.unwrap(options.scrollEnabled) : true;
            var mouseWheelDeltaFactor = ko.unwrap(options.mouseWheelDeltaFactor) !== undefined
                                            ? ko.unwrap(options.mouseWheelDeltaFactor)
                                            : 0.15;
            var pinchEnabled = ko.unwrap(options.pinchEnabled) !== undefined ? ko.unwrap(options.pinchEnabled) : true;
            // other options END

            //css stuff and animations
            var containerClass = ko.unwrap(options.containerClass) || "";
            var containerBackground = ko.unwrap(options.containerBackground) || "transparent";
            var transition = ko.unwrap(options.transition) !== undefined ? ko.unwrap(options.transition) : false;
            //css stuff and animations END

            // controlBar
            var controlBar = ko.unwrap(options.controlBar) !== undefined ? ko.unwrap(options.controlBar) : true;
            var controlsBarClass = ko.unwrap(options.controlsBarClass) || "wf-zoom-controlbar btn-group right-top";
            var zoomInButtonClass = ko.unwrap(options.zoomInButtonClass) || "btn btn-variant-dark";
            var zoomInButtonIconClass = ko.unwrap(options.zoomInButtonIconClass) || "wf wf-add-round";
            var zoomOutButtonClass = ko.unwrap(options.zoomOutButtonClass) || "btn btn-variant-dark";
            var zoomOutButtonIconClass = ko.unwrap(options.zoomOutButtonIconClass) || "wf wf-remove-round";
            var resetButtonClass = ko.unwrap(options.resetButtonClass) || "btn btn-variant-dark";
            var resetButtonIconClass = ko.unwrap(options.resetButtonIconClass) || "wf wf-arrow-refresh-left";
            // controlBar END

            // moveControlBar
            var panControlBar = ko.unwrap(options.panControlBar) !== undefined ? ko.unwrap(options.panControlBar) : false;
            var pixelsToMoveOnPan = ko.unwrap(options.pixelsToMoveOnPan) || 100;
            var panControlsBarClass = ko.unwrap(options.panControlsBarClass) || "wf-pan-controlbar right-bottom";
            var panLeftButtonClass = ko.unwrap(options.panLeftButtonClass) || "btn btn-variant-dark";
            var panLeftButtonIconClass = ko.unwrap(options.panLeftButtonIconClass) || "wf wf-chevron-left";
            var panRightButtonClass = ko.unwrap(options.panRightButtonClass) || "btn btn-variant-dark";
            var panRightButtonIconClass = ko.unwrap(options.panRightButtonIconClass) || "wf wf-chevron-right";
            var panUpButtonClass = ko.unwrap(options.panUpButtonClass) || "btn btn-variant-dark";
            var panUpButtonIconClass = ko.unwrap(options.panUpButtonIconClass) || "wf wf-chevron-up";
            var panDownButtonClass = ko.unwrap(options.panDownButtonClass) || "btn btn-variant-dark";
            var panDownButtonIconClass = ko.unwrap(options.panDownButtonIconClass) || "wf wf-chevron-down";
            // controlBar END

            // OPTIONS END

            //Create and inject the controlBar 
            if (controlBar) {
                var zoom = "'reset'";
                var $controlsBar = $('<div class="' + controlsBarClass + '"></div>');
                var $zoomInElement = $('<button class="' +
                    zoomInButtonClass +
                    '"><i class="' +
                    zoomInButtonIconClass +
                    '"></i></div>').appendTo($controlsBar);
                var $resetElement = $('<button class="' +
                    resetButtonClass +
                    '"><i class="' +
                    resetButtonIconClass +
                    '"></i></div>').appendTo($controlsBar);
                var $zoomOutElement = $('<button class="' +
                    zoomOutButtonClass +
                    '"><i class="' +
                    zoomOutButtonIconClass +
                    '"></i></div>').appendTo($controlsBar);
                $controlsBar.insertAfter($element);
            };

            //Create and inject the panControlBar 
            if (panControlBar) {
                var $panControlsBar = $('<div class="' + panControlsBarClass + '"></div>');

                var $panLeftElement = $('<button class="' + panLeftButtonClass +
                    '"><i class="' +
                    panLeftButtonIconClass +
                    '"></i></div>').click(function () {
                    $element.smartZoom("pan", -pixelsToMoveOnPan, 0);
                }).appendTo($panControlsBar);
                var $panRightElement = $('<button class="' +
                    panRightButtonClass +
                    '"><i class="' +
                    panRightButtonIconClass +
                    '"></i></div>').click(function () {
                    $element.smartZoom("pan", pixelsToMoveOnPan, 0);
                }).appendTo($panControlsBar);
                var $panUpElement = $('<button class="' +
                    panUpButtonClass +
                    '"><i class="' +
                    panUpButtonIconClass +
                    '"></i></div>').click(function () {
                    $element.smartZoom("pan", 0, pixelsToMoveOnPan);
                }).appendTo($panControlsBar);
                var $panDownElement = $('<button class="' +
                    panDownButtonClass +
                    '"><i class="' +
                    panDownButtonIconClass +
                    '"></i></div>').click(function () {
                    $element.smartZoom("pan", 0, -pixelsToMoveOnPan);
                }).appendTo($panControlsBar);

                $panControlsBar.insertAfter($element);
            };

            //bundel options for functions
            var settings = {
                    maxScale: maxScale,
                    minScale: minScale,
                    top: top,
                    left: left,
                    width: width,
                    height: height,
                    initCallback: initCallback,
                    easing: easing,
                    border: border,
                    mouseEnabled: mouseEnabled,
                    mouseMoveEnabled: mouseMoveEnabled,
                    moveCursorEnabled: moveCursorEnabled,
                    touchEnabled: touchEnabled,
                    touchMoveEnabled: touchMoveEnabled,
                    adjustOnResize: adjustOnResize,
                    transition: transition,
                    dblClickMaxScale: dblClickMaxScale,
                    scrollEnabled: scrollEnabled,
                    mouseWheelDeltaFactor: mouseWheelDeltaFactor,
                    zoomOnSimpleClick: zoomOnSimpleClick,
                    containerClass: containerClass,
                    containerBackground: containerBackground,
                    zoomInElement: $zoomInElement,
                    zoomOutElement: $zoomOutElement,
                    resetElement: $resetElement,
                    initPosition: initPosition,
                    initScale: initScale,
                };

            // wait for retrun from browser to get the right height/width 
            var checkExist = setInterval(function () {
                if ($element.height() != 0 && $element.width() != 0) {
                    //create container with js
                    enable($element, settings);
                    clearInterval(checkExist);
                }
            }, 500); // check every 1000ms

        },
    };

function enable(element, options) {
    element.smartZoom({
            maxScale: options.maxScale,
            minScale: options.minScale,
            top: options.top,
            left: options.left,
            width: options.width,
            height: options.height,
            initCallback: options.initCallback,
            easing: options.easing,
            border: options.border,
            mouseEnabled: options.mouseEnabled,
            mouseMoveEnabled: options.mouseMoveEnabled,
            moveCursorEnabled: options.moveCursorEnabled,
            touchEnabled: options.touchEnabled,
            touchMoveEnabled: options.touchMoveEnabled,
            adjustOnResize: options.adjustOnResize,
            transition: options.transition,
            scrollEnabled: options.scrollEnabled,
            mouseWheelDeltaFactor: options.mouseWheelDeltaFactor,
            dblClickMaxScale: options.dblClickMaxScale,
            zoomOnSimpleClick: options.zoomOnSimpleClick,
            containerClass: options.containerClass,
            containerBackground: options.containerBackground,
            zoomInElement: options.zoomInElement,
            zoomOutElement: options.zoomOutElement,
            resetElement: options.resetElement,
            zoom: 10,
            initPosition: options.initPosition,
            initScale: options.initScale,
        });
}


// Example: 
//<div data-bind="viewBox: { }">
//  <div>...</div>
//</div>
// optimal parameter
//@contentId 
//@maxScale

ko.bindingHandlers.viewBox = {
    update: function (element, valueAccessor) {

        var options = ko.unwrap(valueAccessor()) || {};

        var $parentContaner = $(element),
            $contentDiv = options.contentId
                              ? $parentContaner.find("#" + options.contentId).first()
                              : $parentContaner.find("div").first(),
            $wrapper = $("<div></div>");

        if ($contentDiv.length === 0) return;

        //set max scale
        var maxScale = options.maxScale || 100;

        //create wrapper
        $parentContaner.append($wrapper);
        $wrapper.append($contentDiv);

        var checkExist = setInterval(function () {

            //get original width
            var elWidth = $contentDiv.outerWidth();

            if ($parentContaner.height() !== 0 && $parentContaner.width() !== 0) {
                function doResize(event, ui) {

                    //get offse before scale
                    var contentLeft = $contentDiv.offset().left;
                    var contentTop = $contentDiv.offset().top;

                    //calculate scale
                    var width = Math.min($parentContaner.width(), $(window).width());
                    var scale = Math.min(maxScale, width / elWidth);

                    //set scale
                    $contentDiv.css({ transform: "scale(" + scale + ")" });

                    //set size for wrapper
                    $wrapper.width($contentDiv.width() * scale);
                    $wrapper.height($contentDiv.height() * scale);

                    //move content to point before scale
                    $contentDiv.css({
                        transform: "translate(" + (contentLeft - $contentDiv.offset().left) + "px, " + (contentTop - $contentDiv.offset().top) + "px) scale(" + scale + ")"
                        });
                }

                doResize(null);

                $(window).resize(function () {
                    doResize(null);
                });

                clearInterval(checkExist);
            }
        }, 1000); // check every 1000ms
    }
};


// Example: <div data-bind="viewBox: { }">....</div>
// optimal parameter
//@width 
//@height
//@transformOrigin
//ko.bindingHandlers.viewBox = {

//    update: function (element, valueAccessor) {
//        var $element = $(element);
//        var options = ko.unwrap(valueAccessor()) || {};
//        var width = ko.unwrap(options.width) || 0;
//        var height = ko.unwrap(options.height) || 0;
//        var transformOrigin = ko.unwrap(options.transformOrigin) || "left top";

//        //check if the element are exist with a size 
//        var checkExist = setInterval(function () {
//            if ($element.height() != 0 && $element.width() != 0) {

//                $element.jviewBox({
//                    width: width,
//                    height: height,
//                    transformOrigin: transformOrigin
//                });
//                clearInterval(checkExist);
//            }
//        }, 1000); // check every 1000ms
        
//    },
//};




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


// Knockout binding handler for Bootstrap select picker
ko.bindingHandlers.selectpicker = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var picker = valueAccessor();

        //#region Set options
        var option = {};

        if (picker.size && ko.unwrap(picker.size))
            option.size = ko.unwrap(picker.size);

        if (picker.optionsTitle && ko.unwrap(picker.optionsTitle) !== undefined)
            option.title = ko.unwrap(picker.optionsTitle);

        if (picker.liveSearch && ko.unwrap(picker.liveSearch) !== undefined)
            option.liveSearch = ko.unwrap(picker.liveSearch);

        if (picker.width && ko.unwrap(picker.width) !== undefined)
            option.width = ko.unwrap(picker.width);

        if (picker.header && ko.unwrap(picker.header) !== undefined)
            option.header = ko.unwrap(picker.header);

        if (picker.style && ko.unwrap(picker.style) !== undefined)
            option.style = ko.unwrap(picker.style);

        //#endregion

        $(element).addClass('selectpicker').selectpicker(option);

        if (option.style)
            $(element).selectpicker('setStyle', option.style, 'add');

        if (picker.options) {
            options = ko.isObservable(picker.options) ? picker.options : ko.observableArray(picker.options);
            ko.bindingHandlers.options.init(element, options, allBindingsAccessor);
        }

        $(element).on('hidden.bs.select', function (e) {
            var selectedValues = [];

            $(this).find("option:selected").each(function (i, selected) {
                selectedValues[i] = $(selected).val();
            });

            var evt = $.Event('selectchanged');
            evt.selectedValues = selectedValues;

            $(this).trigger(evt);

            if (picker.selectedOptions && ko.isObservable(picker.selectedOptions)) {
                picker.selectedOptions.valueWillMutate();
                var isArray = $.isArray(ko.utils.unwrapObservable(picker.selectedOptions()));
                if (isArray)
                    picker.selectedOptions([]);

                for (var i = 0; i < selectedValues.length; i++)
                    isArray ? picker.selectedOptions.push(selectedValues[i]) : picker.selectedOptions(selectedValues[i]);
                picker.selectedOptions.valueHasMutated();
            }
        });
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        var picker = valueAccessor();
        var isDisabled = picker.disabled ? ko.unwrap(picker.disabled) : false;

        if (picker.options) {
            options = ko.isObservable(picker.options) ? picker.options : ko.observableArray(picker.options);
            ko.bindingHandlers.options.update(element, options, allBindingsAccessor);
        }

        $(element).prop('disabled', isDisabled);

        $(element).selectpicker('refresh');

        if (ko.unwrap(picker.selectedOptions) && ko.isObservable(picker.selectedOptions) && $(element).prop('multiple') && $.isArray(ko.utils.unwrapObservable(picker.selectedOptions()))) {
            // in the case of a multiple select where the valueAccessor() is an observableArray, call the default Knockout selectedOptions binding
            ko.bindingHandlers.selectedOptions.init(element, picker.selectedOptions, allBindingsAccessor);
        }
        else
            $(element).selectpicker('val', ko.unwrap(picker.selectedOptions));

    }
};


// Knockout binding handler for Bootstrap date time picker
// bindingContext.$data.isEdited is used to make the editing from the textbox and picker not overstep on each other

ko.bindingHandlers.colorpicker = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        $(element).colorpicker();

        var colorPicker = valueAccessor();
        var disabled = colorPicker && colorPicker.disabled && ko.unwrap(colorPicker.disabled) ? 'disable' : 'enable';

        $(element).colorpicker(disabled);

        ko.utils.domNodeDisposal.addDisposeCallback(element,
            function () {
                $(element).colorpicker('destroy');
            });

        var debounced = _.debounce(function () {
            var color = "#000000";
            var colorPicker = valueAccessor();
            var colorConvert = ko.unwrap(colorPicker.colorConvert) !== undefined ? ko.unwrap(colorPicker.colorConvert) : 0;

            if (colorConvert === 0) {
                color = $(element).data("colorpicker").color.toHex();
            }
            if (colorConvert === 1) {
                color = $(element).data("colorpicker").color.toString();
            }

            if (ko.isObservable(colorPicker.selectedColor)) {
                if ((color === "#aN" || (color.indexOf("undefined") != -1) || (color.indexOf("NaN") != -1)) && colorConvert === 1) {
                    color = null;
                }
                colorPicker.selectedColor(color);
            }
        }, 100, true);


        //when a user changes the date, update the view model
        $(element).on("changeColor", debounced);
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var colorPicker = valueAccessor();

        var selectedValue = colorPicker && colorPicker.selectedColor ? ko.unwrap(colorPicker.selectedColor) : "#000000";
        $(element).colorpicker('setValue', selectedValue);

        var disabled = colorPicker && colorPicker.disabled && ko.unwrap(colorPicker.disabled) ? 'disable' : 'enable';
        $(element).colorpicker(disabled);

    }
};


// Knockout binding handler for Virtual Keyboard
//https://github.com/Mottie/Keyboard

ko.bindingHandlers.keyboard = {
    init: function (element, valueAccessor, allBindingsAccessor) {

        if (!window ||
            !window.clientConfiguration ||
            !window.clientConfiguration.useVirtualKeyboard) {
            return;
        }

        var keyboardType = valueAccessor() && valueAccessor().toString().toLowerCase().startsWith('alpha') ? 'alpha' : 'num';

        $(element).keyboard({
            layout: keyboardType,
            usePreview: true, // disabled for contenteditable
            useCombos: false,
            autoAccept: true,
            language: window.clientConfiguration.languageCode
        });

        $(element).focus(function() {
            var keyboard = $(element).getkeyboard();

            if (keyboard.language !== window.clientConfiguration.languageCode) {
                keyboard.language = window.clientConfiguration.languageCode;
                keyboard.redraw();
            }
        });
    }
};


// Helper Bingind handler for formating dates with moment.js(http://momentjs.com/)
// Example: <span formattedDate: { value: date, format: 'DD.MM.YYYY', locale: 'de' }></span>

ko.bindingHandlers.formattedDate = {
    update: function (element, valueAccessor) {
        var options = ko.unwrap(valueAccessor());
        var value = ko.unwrap(options.value);
        var locale = ko.unwrap(options.locale);

        if (locale)
            moment.locale(locale);

        var format = ko.unwrap(options.format || "DD.MM.YYYY HH:mm:ss");

        if (typeof (value) === "undefined" || value === null) {
            return;
        }

        var momentDate = moment(value);
        var formattedDate = momentDate.format(format);
        $(element).text(formattedDate);
    }
};

// KO binding handlers for formating numerical values with numeral library

// Helper function for format numerical values with numeral library
// http://numeraljs.com/
var formatNumber = function (element, valueAccessor, allBindingsAccessor, format) {
    // Provide a custom text value
    var value = valueAccessor(),
        allBindings = allBindingsAccessor();
    var numeralFormat = allBindings.format || format;
    var strNumber = ko.unwrap(value);

    var language = ko.unwrap(allBindings.language);
    if (language !== undefined)
        numeral.locale(language);

    if (strNumber !== undefined && strNumber !== null) {//therefore 0 is value. But without this check not render value 
        return numeral(strNumber).format(numeralFormat);
    }
    return "";
};

// Can be used for formating values in text
ko.bindingHandlers.numeraltext = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        $(element).text(formatNumber(element, valueAccessor, allBindingsAccessor, "0,0.00"));
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        $(element).text(formatNumber(element, valueAccessor, allBindingsAccessor, "0,0.00"));
    }
};

// Can be used for formating values in input fields
ko.bindingHandlers.numeralvalue = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        $(element).val(formatNumber(element, valueAccessor, allBindingsAccessor, "0,0.00"));

        //handle the field changing
        ko.utils.registerEventHandler(element,
            "change",
            function () {
                var observable = valueAccessor();
                observable($(element).val());
            });
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        $(element).val(formatNumber(element, valueAccessor, allBindingsAccessor, "0,0.00"));
    }
};
// Can be used for formating percent values in text
ko.bindingHandlers.percenttext = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        $(element).text(formatNumber(element, valueAccessor, allBindingsAccessor, "0.000%"));
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        $(element).text(formatNumber(element, valueAccessor, allBindingsAccessor, "0.000%"));
    }
};
// Can be used for formating percent values in input fields
ko.bindingHandlers.percentvalue = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        $(element).val(formatNumber(element, valueAccessor, allBindingsAccessor, "0.000%"));

        //handle the field changing
        ko.utils.registerEventHandler(element,
            "change",
            function () {
                var observable = valueAccessor();
                observable($(element).val());
            });
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        $(element).val(formatNumber(element, valueAccessor, allBindingsAccessor, "0.000 %"));
    }
};


var wf = wf || {};
wf.utilities = (function () {
    String.prototype.replaceAll = function (search, replace) {
        if (replace === undefined) {
            return this.toString();
        }
        return this.split(search).join(replace);
    };

    function ResolvePagePlaceholders(animatedClass, animatedClassApplyDuration) {
        var searchString = window.location.search.substring(1);
        var defaultNavigationParameterPlaceholder = document.getElementById("defaultNavigationParameters"); //search special div with id. The Value should be JSON with default parameters. {"ParameterName":"ParameterValue"}
        var beforeApply = function () {
            if (animatedClass)
                $(document.body).addClass(animatedClass);
        };

        var afterApply = function () {
            if (animatedClass && animatedClassApplyDuration)
                var timer = setTimeout(function () {
                    $(document.body).removeClass(animatedClass);
                    clearTimeout(timer);
                },
                    animatedClassApplyDuration);
        };

        document.body.innerHTML = resolvePlaceholders(defaultNavigationParameterPlaceholder, searchString, document.body.innerHTML, beforeApply, afterApply);
    }

    function ResolveStringPlaceholders(url, content) {
        var searchString = url.split("?")[1];
        var $wrap = $("<div/>").html(content);
        var defaultNavigationParameterPlaceholder = $wrap.find("#defaultNavigationParameters").first();
        defaultNavigationParameterPlaceholder = defaultNavigationParameterPlaceholder ? defaultNavigationParameterPlaceholder : null;

        return resolvePlaceholders(defaultNavigationParameterPlaceholder, searchString, content);
    }

    function resolvePlaceholders(defaultNavigationParameterPlaceholder, searchString, content, beforApplyCallback, afterApplyCallback) {
        var defaultNavigationParameters = parseNavigationPlaceholder(defaultNavigationParameterPlaceholder);
        var queryStringParameters = getQueryStringParameters(searchString);

        if (!queryStringParameters && !defaultNavigationParameters)
            return content;

        queryStringParameters = queryStringParameters ? queryStringParameters : {};

        addParametersFromDefaultToNonExistingQueryStringParameters(queryStringParameters, defaultNavigationParameters);

        if (Object.keys(queryStringParameters).length > 0) {
            if (beforApplyCallback && typeof beforApplyCallback === "function")
                beforApplyCallback();

            for (var property in queryStringParameters) {
                if (queryStringParameters.hasOwnProperty(property)) {
                    content = content.replaceAll("[PC:" + property + "]", queryStringParameters[property]);
                }
            }

            if (afterApplyCallback && typeof afterApplyCallback === "function")
                afterApplyCallback();
        }

        return content;

    }

    function getQueryStringParameters(queryString) {
        if (!queryString || queryString.length === 0)
            return null;

        var params = {};

        var queryStringParameters = queryString.split("&");

        //create object from url parameters
        for (var i = 0; i < queryStringParameters.length; i++) {
            var keyValuePair = queryStringParameters[i].split("=");

            if (!keyValuePair[0].trim())
                continue;

            var key = decodeURIComponent(keyValuePair[0]);
            var value = decodeURIComponent(keyValuePair[1]);

            params[key] = value;
        }

        return params;
    }

    function parseNavigationPlaceholder(placeholder) {

        if (!placeholder)
            return null;

        try {
            return $.parseJSON(placeholder.textContent);
        } catch (e) {
            return null;
        }
    }

    function addParametersFromDefaultToNonExistingQueryStringParameters(queryStringParameters, defaultNavigationParameters) {
        if (!defaultNavigationParameters)
            return;

        for (var property in defaultNavigationParameters) {
            if (defaultNavigationParameters.hasOwnProperty(property)) {
                if (!queryStringParameters[property])
                    queryStringParameters[property] = defaultNavigationParameters[property];
            }
        }
    }

    function initializeConstants(configuration) {
        var config = configuration || {};
        var version = config.version || "3.x.x.x";
        var remoteIISServerUrl = config.remoteIISServerUrl;
        window.i4InstallationUrl = config.i4BaseUrl || "http://localhost:33668";
        window.i4PostfixInstallationUrl = config.i4PostfixUrl || "api/v2";
        window.usei4Connector = config.usei4Connector || false;
        window.disableSignalBrowser = config.disableSignalBrowser || false;
        window.shouldCheckClientSession = config.shouldCheckClientSession !== undefined ? config.shouldCheckClientSession : true;
        window.draggableDialogs = config.draggableDialogs !== undefined ? config.draggableDialogs : false;

        window.clientConfiguration = window.clientConfiguration || {
            useVirtualKeyboard: false,
            languageCode: "en",
            updateRate: 500
        };

        window.clientConfiguration.updateRate = config.updateRate !== undefined ? config.updateRate : window.clientConfiguration.updateRate;

        window.debounceIntervalResolvingSignalDefinitions = config.debounceIntervalResolvingSignalDefinitions !== undefined ? config.debounceIntervalResolvingSignalDefinitions : window.debounceIntervalResolvingSignalDefinitions !== undefined ? window.debounceIntervalResolvingSignalDefinitions : 10;
        window.debounceIntervalResolvingOfSignalIds = config.debounceIntervalResolvingOfSignalIds !== undefined ? config.debounceIntervalResolvingOfSignalIds : window.debounceIntervalResolvingOfSignalIds !== undefined ? window.debounceIntervalResolvingOfSignalIds : 10;
        window.debounceIntervalSubscribeToSignalChangeEvents = config.debounceIntervalSubscribeToSignalChangeEvents !== undefined ? config.debounceIntervalSubscribeToSignalChangeEvents : window.debounceIntervalSubscribeToSignalChangeEvents !== undefined ? window.debounceIntervalSubscribeToSignalChangeEvents : 10;

        var urlPath = window.document.location.href;
        var remoteIISServer = remoteIISServerUrl !== undefined && remoteIISServerUrl ?
            remoteIISServerUrl :
            window.document.location.hostname;

        if (!window.location.origin) {
            window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        }

        window.i4InstallationUrl = window.document.location.origin.replace(window.document.location.hostname, i4InstallationUrl);
        window.signalRUrl = window.i4InstallationUrl + "/signalr/hubs";

        window.rootUrl = urlPath;
        window.rootUrlPrefix = window.document.location.origin.replace(window.document.location.hostname, remoteIISServer);

        if (document.location.port && config.remoteIISServerPort) {
            window.rootUrl = window.rootUrl.replace(document.location.port, config.remoteIISServerPort);
            window.rootUrlPrefix = window.rootUrlPrefix.replace(document.location.port, config.remoteIISServerPort);
        }

        if (document.location.protocol && config.remoteIISServerProtocol) {
            var remoteIISServerProtocol = config.remoteIISServerProtocol.endsWith(":") ? config.remoteIISServerProtocol : config.remoteIISServerProtocol + ":";

            window.rootUrl = window.rootUrl.replace(document.location.protocol, remoteIISServerProtocol);
            window.rootUrlPrefix = window.rootUrlPrefix.replace(document.location.protocol, remoteIISServerProtocol);
        }

        window.appVersion = (version || "").replace("-", ".");
        window.defaultTimeZone = "UTC";

        window.resolveUrl = function (rootedUrl) {
            if (!rootedUrl) {
                return rootedUrl;
            }

            //  ~/_Services/WebServices/WCF/AlarmsService.svc
            if (rootedUrl.substring(0, 2) === "~/") {
                return rootedUrl.replace("~/", window.rootUrlPrefix + "/");
            }

            //  /_Services/WebServices/WCF/AlarmsService.svc
            if (rootedUrl.substring(0, 1) === "/") {
                return window.rootUrlPrefix + rootedUrl;
            }

            //  http://localhost/_Services/WebServices/WCF/AlarmsService.svc
            return rootedUrl.replace(window.document.location.hostName, remoteIISServer);
        };

        window.resolveHeaders = function (headers) {
            if (config.customHeaders) {
                return config.customHeaders;
            }

            if (!headers) {
                headers = {};
            }

            //headers["cache-control"] = "no-cache";
            return headers;
        };
    }

    function initializeModalLoading() {

        var draggable = window.draggableDialogs ? "data-bind=\"draggable:{showCoordinates: false, isActive: true, handle: '.modal-header'}\"" : "";

        document.body.insertAdjacentHTML('beforeend',
            "<div id='wfModal' class='modal fade' style='display: none;'" + draggable + "> <div class='modal-dialog'> <div class='modal-content' style='overflow-x: hidden;'> <div class='modal-header'> <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button> <div class='modal-title'>Test draggable</div> </div> <div class='modal-body p-a-0'></div> <div class='modal-footer'> <button type='button' class='btn btn-primary' data-dismiss='modal'> <i class='wf wf-small-x-round-o m-r-sm'></i> <wf-symbolictext params='symbolicText: \"I4SCADA_Close\"'></wf-symbolictext> </button> </div> </div> </div> </div>");

        $(document).ready(function () {
            $('#wfModal')
                .on('hidden.bs.modal',
                    function (event) {
                        var modal = $(this);
                        var modalBodyContent = $('#wf-modal-content')[0];

                        // Clean Knockput bindings and clear modal dialog body container
                        if (modalBodyContent) {
                            ko.cleanNode(modalBodyContent);
                        }
                        modal.find('.modal-body').empty();

                        // Remove the added class names on the modal dialog container  beside the default name
                        modal.find('.modal-dialog').removeClass().addClass('modal-dialog');
                        modal.find('.modal-header').removeClass().addClass('modal-header');

                        // workaround to delete backdrops with are not related to a modal dialog
                        removeNotNeededBackdrops();
                    });

            $('#wfModal')
                .on('show.bs.modal',
                    function (event) {
                        var modal = $(this);

                        var button = $(event.relatedTarget); // Element that triggered the modal
                        var src = button.data('src'); // Extract info from data-* attributes
                        var placement = button.data('placement') || "center";
                        var bodyHeight = button.data('height');
                        var bodyWidth = button.data('width');
                        var title = button.data('title') || "";
                        var className = button.data('class') + " modal-" + placement;
                        var headerClass = button.data('header-class');
                        var localSrc = button.data('local-src');
                        //modal.find('.modal-dialog').removeClass('modal-md modal-sm modal-lg').addClass(size);

                        var objectID = null;
                        try {
                            var params = button.attr("params");
                            eval("var result ={" + params + "}");
                            objectID = result ? result.hasOwnProperty("objectID") ? result.objectID : null : null;
                        } catch (error) { }

                        modal.find('.modal-dialog').addClass(className);

                        if (title === "") {
                            modal.find('.modal-header').hide();
                        } else {
                            var resolvedTitle = title.stringPlaceholderResolver(objectID);
                            var $newWidget = $('<wf-symbolictext params="symbolicText:\'' + resolvedTitle + '\'"></wf-symbolictext>');
                            modal.find('.modal-title').html("").append($newWidget);

                            //Apply bindings 
                            if ($newWidget[0]) {
                                ko.cleanNode($newWidget[0]);
                                ko.applyBindings({}, $newWidget[0]);
                            }

                            modal.find('.modal-header').addClass(headerClass);
                            modal.find('.modal-header').show();
                        }

                        modal.find('.modal-dialog').css("width", bodyWidth);
                        modal.find('.modal-body').css("height", bodyHeight);
                        modal.find('.modal-body').css("width", bodyWidth);

                        if (src) {
                            src = src.stringPlaceholderResolver(objectID);
                            $.get(src, function (responseText) {
                                buildModal(responseText, modal, src, objectID);
                            });
                        } else if (localSrc) {
                            localSrc = localSrc.stringPlaceholderResolver(objectID);
                            var localContainer = document.getElementById("wf-local-modal-" + localSrc);
                            if (localContainer) {
                                buildModal(localContainer.innerHTML, modal, localSrc, objectID);
                            }
                        }
                        // workaround to delete backdrops with are not related to a modal dialog
                        removeNotNeededBackdrops();
                    });

            var hidden, visibilityChange;
            if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
                hidden = "hidden";
                visibilityChange = "visibilitychange";
            } else if (typeof (document).msHidden !== "undefined") {
                hidden = "msHidden";
                visibilityChange = "msvisibilitychange";
            } else if (typeof (document).webkitHidden !== "undefined") {
                hidden = "webkitHidden";
                visibilityChange = "webkitvisibilitychange";
            }
            if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
                console.warn("visibilitychange event is not supported");
            } else {
                // Handle page visibility change   
                document.addEventListener(visibilityChange, () => {
                    removeNotNeededBackdrops();
                });
            }
        });

        function buildModal(responseText, modal, src, objectID) {
            var $modalBody = modal.find('.modal-body');
            // Resolve parameter placeholders in loaded html
            responseText = wf.utilities.ResolveStringPlaceholders(src, responseText).stringPlaceholderResolver(objectID, false);
            $modalBody.append('<div id="wf-modal-content" class="stretched overflow-auto"></div>');
            var $modalBodyContent = modal.find('#wf-modal-content');
            // ToDo: Stip the HTML in order to inject only the content of the body and CSS references
            // console.log(responseText);
            $modalBodyContent.html(responseText);
            // Apply bindings in injected html
            if ($modalBodyContent[0]) {
                ko.cleanNode($modalBodyContent[0]);
                ko.applyBindings({}, $modalBodyContent[0]);
            }
        }

        function removeNotNeededBackdrops() {
            // workaround to delete backdrops with are not related to a modal dialog
            var backdrops = $("body").find(".modal-backdrop");
            for (let index = 0; index < backdrops.length; index++) {
                var element = backdrops[index];
                var events = $._data(element, "events");
                if (events == null) {
                    element.remove();
                }
            }
        }
    }

    function InitilizeConstants(version, remoteIISServerUrl, i4BaseUrl, usei4Connector, disableSignalBrowser) {
        initializeConstants({
            version: version,
            remoteIISServerUrl: remoteIISServerUrl,
            i4BaseUrl: i4BaseUrl,
            usei4Connector: usei4Connector,
            disableSignalBrowser: disableSignalBrowser
        });
    }

    function InitilizeModalLoading() {
        initializeModalLoading();
    }

    function replaceWfPopupInfoLayerParameter() {
        var layers = document.getElementsByClassName("wf-popup-info-layer");
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var objectID = layer.getAttribute("data-wf-object-ID");
            layer.innerHTML = layer.innerHTML.replaceAll("[ONID]", layer.getAttribute("data-wf-object-name-ID").stringPlaceholderResolver(objectID));
            layer.innerHTML = layer.innerHTML.replaceAll("[SP]", layer.getAttribute("data-wf-signal-prefix").stringPlaceholderResolver(objectID));
        }

        document.body.innerHTML = document.body.innerHTML;
    }

    return {
        ResolveStringPlaceholders: ResolveStringPlaceholders,
        ResolvePagePlaceholders: ResolvePagePlaceholders,
        initializeConstants: initializeConstants,
        initializeModalLoading: initializeModalLoading,
        replaceWfPopupInfoLayerParameter: replaceWfPopupInfoLayerParameter,
        //legacy
        InitilizeConstants: InitilizeConstants,
        InitilizeModalLoading: InitilizeModalLoading
    }
}());


(function () {
    var
        fullScreenApi = {
                supportsFullScreen: false,
                isFullScreen: function () { return false; },
                requestFullScreen: function () { },
                cancelFullScreen: function () { },
                fullScreenEventName: '',
                prefix: ''
            },
        browserPrefixes = 'webkit moz o ms khtml'.split(' ');

    // check for native support
    if (typeof document.cancelFullScreen != 'undefined') {
        fullScreenApi.supportsFullScreen = true;
    } else {
        // check for fullscreen support by vendor prefix
        for (var i = 0, il = browserPrefixes.length; i < il; i++) {
            fullScreenApi.prefix = browserPrefixes[i];

            if (typeof document[fullScreenApi.prefix + 'CancelFullScreen'] != 'undefined') {
                fullScreenApi.supportsFullScreen = true;

                break;
            }
        }
    }

    // update methods to do something useful
    if (fullScreenApi.supportsFullScreen) {
        fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';

        fullScreenApi.isFullScreen = function () {
            switch (this.prefix) {
                case '':
                    return document.fullScreen;
                case 'webkit':
                    return document.webkitIsFullScreen;
                default:
                    return document[this.prefix + 'FullScreen'];
            }
        }
        fullScreenApi.requestFullScreen = function (el) {
            return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
        }
        fullScreenApi.cancelFullScreen = function (el) {
            return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
        }
    }

    // jQuery plugin
    if (typeof jQuery != 'undefined') {
        jQuery.fn.requestFullScreen = function () {

            return this.each(function () {
                if (fullScreenApi.supportsFullScreen) {
                    fullScreenApi.requestFullScreen(this);
                }
            });
        };
    }

    // export api
    window.fullScreenApi = fullScreenApi;
})();


/**
* This is binding handler open browser in full screen mode by click on element
* Don't work in IE
* eg. <i class="wf wf-fullscreen" data-bind="toggleFullScreen: {}"/>
*/
ko.bindingHandlers.toggleFullScreen = {
    init: function (element) {
        if (fullScreenApi.supportsFullScreen) {
            element.addEventListener('click', function () {

                if (!fullScreenApi.isFullScreen()) {
                    fullScreenApi.requestFullScreen(document.documentElement);
                } else {
                    fullScreenApi.cancelFullScreen(document.documentElement);
                }
            }, { passive: true, capture: true });
        }
    }
};


/**
 * Hide element when it is empty
 * eg. <div data-bind="hideIfEmpty: {}"/>
 */
ko.bindingHandlers.hideIfEmpty = {
	update: function (element) {
		if ($(element).is(":empty") || !$.trim($(element).text()).length) {
		    $(element).css("display", "none");
		}
	}
};


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


function absolute(base, relative) {
    if (relative.indexOf(".") === -1 && relative.indexOf("..") === -1) {
        var a = document.createElement('a');
        a.href = relative;
        return a.href;
    }

    var stack = base.split("/"),
        parts = relative.split("/");
    stack.pop(); // remove current file name (or empty string)
    // (omit if "base" is the current folder without trailing slash)
    for (var i = 0; i < parts.length; i++) {
        if (parts[i] == ".")
            continue;
        if (parts[i] == "..")
            stack.pop();
        else
            stack.push(parts[i]);
    }
    return stack.join("/");
}

/**
 * The element where this binding will be applied to, get at runtime a class active if the related document is opened.
 * @param {string} url - the relative path to a HTML page.
 * eg. <div data-bind="activeUrl: {url: '#widgets' }"/>
 */

ko.bindingHandlers.activeUrl = {
    init: function (element, valueAccessor) {
        var url = valueAccessor().url || null;
        url = ko.unwrap(url) || element.getAttribute("data-wf-activeUrl");
        if (!url || !url.trim())
            return;

        url = absolute(document.location.href, url.trim());

        if (url === window.location.href)
            $(element).addClass("active");
    }
};


/**
 * Bingind handler for jQuery resizeble plugin - https://github.com/RickStrahl/jquery-resizable
 * @param {string} handleSelector - null. optional selector for handle that starts dragging
 * @param {boolean} resizeWidth - true. resize the width
 * @param {boolean} resizeHeight - true. resize the height
 * @param {string} resizeWidthFrom - 'right'. The side that the width resizing is relative to
 * @param {string} resizeHeightFrom - 'bottom'. the side that the height resizing is relative to
 * @param {function} onDragStart - null. hook into start drag operation (event,$el,opt passed - return false to abort drag)
 * @param {function} onDragEnd - null. hook into stop drag operation (event,$el,opt passed)
 * @param {function} onDrag - null. hook into each drag operation (event,$el,opt passed)
 * @param {boolean} touchActionNone - true. disable touch-action on the $handle. prevents browser level actions like forward back gestures
 * @param {boolean} createDefaultHandle - false. Create handler (div) in right bottom corner
 * @param {boolean} stopPropagation - false. disable buble behavior of events
*/

ko.bindingHandlers.resizable = {
    init: function (element, valueAccessor) {
        var $element = $(element);
        var options = valueAccessor();

        $element.resizable(options);
    },
};


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


ko.bindingHandlers.sortTable = {
    init: function (element, valueAccessor) {

        var options = valueAccessor();

        var ascIcon = options.ascIcon || "wf wf-shape-triangle";
        var descIcon = options.descIcon || "wf wf-shape-triangle wf-w";
        var iconCssClass = options.iconCssClass || "";
        var excludeColumnIndexs = options.excludeColumnIndexs || [];

        if (!options.sortFunction || typeof (options.sortFunction) !== 'function') return;

        $(element).on("click", "th", function (event) {
            var th = event.currentTarget,
                sort = $(th).data("sort"),
                asc = true;

            if (excludeColumnIndexs.indexOf($(th).index()) !== -1) return;

            if (sort)
                asc = sort === "asc" ? false : true; // revert

            options.sortFunction($(th).index(), asc);

            //remove all sort attr and icons
            $(element).find('thead th').each(function (index, th) {
                $(th).removeData("sort");
                $(th).find("span.sortIcon").remove();
            });

            //set attr
            $(th).data("sort", asc ? "asc" : "desc");
            //add icon
            var span = $("<span/>");
            $(span).addClass(iconCssClass);
            $(span).addClass(asc ? ascIcon : descIcon);
            $(span).addClass("sortIcon");
            $(span).appendTo($(th));
        });
    },
};



ko.bindingHandlers.fixTableHeader = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            if (valueAccessor().wrapperId)
                document.getElementById(valueAccessor().wrapperId).addEventListener("scroll", function () {
                    $(this).find("thead").css({
                            '-webkit-transform': 'translate(0,' + this.scrollTop + 'px)',
                            '-moz-transform': 'translate(0,' + this.scrollTop + 'px)',
                            '-ms-transform': 'translate(0,' + this.scrollTop + 'px)',
                            '-o-transform': 'translate(0,' + this.scrollTop + 'px)',
                            'transform': 'translate(0,' + this.scrollTop + 'px)'
                        });
                }, { passive: true });
        },
    };



// Custom KO binding for a draggable jQuery plugin
// Example: <div data-bind="draggable: { }"></div>

ko.bindingHandlers.draggable = {
    init: function (element) {
        var $element = $(element);

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $element.draggable('destroy');
        });
    },

    update: function (element, valueAccessor) {
        var options = valueAccessor();
        var $element = $(element);

        var isActive = options.isActive !== undefined ? ko.unwrap(options.isActive) : true;
        if (isActive)
            $element.draggable(options);
        else
            $element.draggable('destroy');
    }
};


// Experimental custom KO binding handler for setting random offset position of the assigned item
// Example: <div data-bind="randomPosition: {topMin: 20,  topMax: 200, leftMin: 10,  leftMax: 200,}"></div>

ko.bindingHandlers.randomPosition = {
        init: function (element, valueAccessor) {
            var options = valueAccessor();
            var topMin = ko.unwrap(options.topMin) || 1;
            var topMax = ko.unwrap(options.topMax) || 300;
            var leftMin = ko.unwrap(options.leftMin) || 1;
            var leftMax = ko.unwrap(options.leftMax) || 300;

            $element = $(element);
            $element.draggable(options);

            $element.css("left", Math.floor(Math.random() * (leftMax - leftMin + 1)) + leftMin);
            $element.css("top", Math.floor(Math.random() * (topMax - topMin + 1)) + topMin);
        }
    };



// Knockout binding handler for Bootstrap Tooltip
//Based on Knockstrap https://github.com/faulknercs/Knockstrap

ko.bindingHandlers.tooltip = {
    init: function (element) {
        var $element = $(element);

        ko.utils.domNodeDisposal.addDisposeCallback(element,
            function () {
                if ($element.data('bs.tooltip')) {
                    $element.tooltip('destroy');
                }
            });
    },

    update: function (element, valueAccessor) {
        var $element = $(element),
            value = ko.unwrap(valueAccessor()),
            options = ko.utils.unwrapProperties(value);

        var tooltipData = $element.data('bs.tooltip');

        if (!tooltipData) {
            $element.tooltip(options);
        } else {
            ko.utils.extend(tooltipData.options, options);
        }
    }
};


// Knockout binding handler that makes text fadein on change
// Optional parameter: @duration

ko.bindingHandlers.fadeInText = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        var duration = allBindingsAccessor.fadeDuration || 500;
        $(element).hide();
        ko.bindingHandlers.text.update(element, valueAccessor);
        $(element).fadeIn(duration);
    }
};


// Knockout binding handler that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
// Optional parameters: @duration

ko.bindingHandlers.fadeVisible = {
    init: function (element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value));
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        var duration = allBindingsAccessor.fadeDuration || 500;
        ko.unwrap(value) ? $(element).fadeIn(duration) : $(element).fadeOut(duration);
    }
};


// KO binding handlers for toggle css class(es) on an element based on jQuery toggleClass
ko.bindingHandlers.toggleClass = {
    update: function (element, valueAccessor) {
        var cssClass = ko.unwrap(valueAccessor());
        var $element = $(element);

        $element.click(function () {
            $element.toggleClass(cssClass);
        });
    }
};


ko.bindingHandlers.addAuthorizationClass = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        var valueUnwrapped = ko.unwrap(value);
        var cssClass = "has-no-authorization";
        var parentIndex = 1
        var hasNoAuthorization = null;

        if (allBindings.has("hasNoAuthorization")) {
            hasNoAuthorization = ko.unwrap(allBindings.get("hasNoAuthorization"));
        }
        if (allBindings.has("parentIndex")) {
            parentIndex = ko.unwrap(allBindings.get("parentIndex"));
        }

        if (hasNoAuthorization === null)
            return;

        parentIndex = parentIndex !== undefined ? parentIndex : 1;

        var container = $(element).parents()[parentIndex];

        if (!container)
            return;

        container = $(container);

        var id = container.attr('id');
        var position = container.css('position');
        var div = container.is("div");

        if (id && position === "absolute" && div)
            hasNoAuthorization ? container.addClass(cssClass) : container.removeClass(cssClass);
    }
};

ko.virtualElements.allowedBindings.addAuthorizationClass = true;


ko.bindingHandlers.innerHtmlValueFowarder = {
    update: function(element, valueAccessor) {
        var data = element.innerHTML;
        var accessor = valueAccessor();
        if(accessor)accessor(data);
    }
}

//# sourceMappingURL=core.bundle.js.map

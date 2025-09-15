// --------------------------------------------------------------------------------------------------
// Knockout Binding Handlers
// --------------------------------------------------------------------------------------------------

// Helper Bingind handler for getting correct URL for Images
ko.bindingHandlers.imagePath = {
    init: function (element, valueAccessor) {
        var appUrl = "";
        var imageUrl = $(element).attr("src");
        if (ko.unwrap(valueAccessor()) === 'global') {
            appUrl = window.rootContentUrl; //window.location.origin
            $(element).attr("src", appUrl + imageUrl);
        }
    }
};

ko.bindingHandlers.toggle = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();

        if (!ko.isObservable(value)) {
            throw new Error('toggle binding should be used only with observable values');
        }

        $(element).on('click', function (event) {
            event.preventDefault();

            var previousValue = ko.unwrap(value);
            value(!previousValue);
        });
    },

    update: function (element, valueAccessor) {
        ko.utils.toggleDomNodeCssClass(element, 'active', ko.unwrap(valueAccessor()));
    }
};

//function getRandomInt(min, max) {
//    return Math.floor(Math.random() * (max - min + 1)) + min;
//}

//function getURL() {
//    var arr = window.location.href.split("/");
//    delete arr[arr.length - 2];
//    return arr.join("/");
//}

// Knockout binding handler for Bootstrap Popover
// Deprecated - sse bsPopover instead -> wf.behaviors.popover.js
//    ko.bindingHandlers.popover = {
//        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

//            var attribute = ko.unwrap(valueAccessor());
//            var cssSelectorForPopoverTemplate = attribute.content;
//            var container = attribute.container || null;

//            var popoverContent = $(element).parentsUntil('.page-host').find(cssSelectorForPopoverTemplate).html();

//            var popOverTemplate = "<div id='" + attribute.id + "-popover'>" + popoverContent + "</div>";
//            $(element)
//                .popover({
//                        content: popOverTemplate,
//                        html: true,
//                        trigger: 'manual',
//                        placement: attribute.placement,
//                        title: attribute.title,
//                        //trigger: attribute.trigger
//                        container: container
//                    });
//            $(element).attr('id', "popover" + attribute.id + "_click");

//            $(element)
//                .click(function () {
//                    $(this).popover('toggle');
//                    var thePopover = document.getElementById(attribute.id + "-popover");
//                    childBindingContext = bindingContext.createChildContext(viewModel);
//                    if (!$(element).hasClass("initialized")) {
//                        ko.applyBindingsToDescendants(childBindingContext, thePopover);
//                    }
//                    $(element).toggleClass("initialized");
//                });
//        },
//};

/*
    Custom KO Binding for gridster.js 
    https://github.com/ducksboard/gridster.js
*/

//ko.bindingHandlers.gridster = {
//    update: function (element, valueAccessor, allBindings, allBindingsAccessor, context) {

//        var options = ko.unwrap(valueAccessor()) || {};
//        var widgetMargins = ko.unwrap(options.widgetMargins) || [5, 5];
//        var widgetBaseDimensions = ko.unwrap(options.widgetBaseDimensions) || [120, 120];

//        var widgetResizeable = ko.unwrap(options.widgetResizeable) || false;
//        var widgetDragable = ko.unwrap(options.widgetDraggable) || false;
//        var widgetMinSize = ko.unwrap(options.widgetMinSize) || [1, 1];
//        var widgetMaxSize = ko.unwrap(options.widgetMaxSize) || [4, 4];

//        var minCols = ko.unwrap(options.minCols) || 2;
//        var maxCols = ko.unwrap(options.maxCols) || 4;

//        var grid = $(element).gridster({
//            widget_margins: widgetMargins,
//            widget_base_dimensions: widgetBaseDimensions,
//            min_cols: minCols,
//            max_cols: maxCols,
//            draggable: {
//                handle: '.wf-drag-handler'
//            },
//            resize: {
//                enabled: widgetResizeable,
//                max_size: widgetMaxSize,
//                min_size: widgetMinSize
//            }
//        }).data('gridster');

//        if (!widgetDragable) {
//            grid.disable();
//        }

//        else {
//            {
//                $(element).children('li').each(function (i, item) {
//                    $('<div class="wf-drag-handler"></div>').appendTo(item);
//                });
//            }
//        }
//    }
//};

// Knockout binding handler for jQuery Knob based control
// https://github.com/aterrien/jQuery-Knob
// http://anthonyterrien.com/knob/

//ko.bindingHandlers.knob = {
//    init: function (element, valueAccessor, allBindingsAccessor) {
//        var options = allBindingsAccessor().sliderOptions || {};
//        var baseChange = options.change;

//        options.release = function (value) {
//            if (baseChange)
//                baseChange(value);

//            var observable = valueAccessor();
//            observable(value);
//        };

//        var $element = $(element);
//        $element.knob(options);

//        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
//            $(element).knob("destroy");
//        });

//        $element.keyup(function (e) {
//            e.preventDefault();
//        });

//        $element.keydown(function (e) {
//            e.preventDefault();
//        });

//        $element.click(function (e) {
//            e.preventDefault();
//        });

//        $element.blur();
//        //$element.disableSelection();
//    },
//    update: function (element, valueAccessor) {
//        var value = ko.utils.unwrapObservable(valueAccessor());
//        var $element = $(element);
//        if (isNaN(value))
//            value = 0;
//        $(element).val(value).trigger('change');
//    }
//};
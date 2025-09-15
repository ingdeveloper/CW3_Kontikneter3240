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
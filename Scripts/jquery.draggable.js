// Simple JQuery Draggable Plugin
// Based on: https://plus.google.com/108949996304093815163/about
// Usage: $(selector).draggable();
// Options:
// handle            => your dragging handle.
//                      If not defined, then the whole body of the
//                      selected element will be draggable
// cursor            => define your draggable element cursor type
// draggableClass    => define the draggable class
// activeHandleClass => define the active handle class
// activeIndex       => define the z-index number of active element
// showCoordinates   => define if the left / top position of active element should be shown while dragging
// showTooltip       => Show Tootip while dragging elements
// showClassAttr     => Show the class attribute value
// showIdAttr        => Show the id attribute value

(function ($) {

    var methods = {
        init: function (opt) {

            opt = $.extend({
                handle: "",
                cursor: "move",
                draggableClass: "draggable draggable-highlighted",
                activeHandleClass: "active-handle",
                activeIndex: 10000,
                showCoordinates: false,
                showTooltip: false,
                showClassAttr: false,
                showIdAttr: true,
                showCssBox: false,
                tooltipContainer: "<b class='draggable-info'></b>",
                coordinatesContainer: "<div class='draggable-data-box' />",
                cssContainer: "<div class='draggable-css-data-box' />",
                isResizable: false,
                resizableHandle: ""
            }, opt);

            this.data("dragoptions", opt);

            var $wrapper = $("<div class='draggable-data-box-wrapper'/>");

            var $selected = null;
            var $elements = (opt.handle === "") ? this : this.find(opt.handle);

            if (!$elements.attr("tabindex"))
                $elements.attr("tabindex", "-1");

            //This global object for page
            var cssClassesContainer = "<p id='crossCssContainer' style='display: none'/>";
            var $crossCssContainer = $(document).find("#crossCssContainer").first();
            if (!$crossCssContainer.length)
                $crossCssContainer = $(cssClassesContainer).appendTo("body");

            var resizableHandle;
            if (opt.isResizable) {
                $elements.resizable({
                    handleSelector: opt.resizableHandle,
                    createDefaultHandle: !opt.resizableHandle
                });
                $elements.css({ position: "relative" });
                resizableHandle = $elements.resizable.handleSelector();
            }

            function updateInfoBoxes() {
                if ($selected === null || $selected === undefined)
                    return;

                var classAttr = $selected.attr('class'),
                    idAttr = $selected.attr('id');

                if (classAttr) {
                    classAttr = classAttr.replace(opt.draggableClass, "").replace("resizable", "");
                    classAttr = classAttr ? "." + $.trim(classAttr).replace(/\s/gi, ".") : "";
                }

                var $boxesWrapper = $('.draggable-data-box-wrapper');
                if (opt.showCoordinates === true || opt.showCssBox === true)
                    if (!$boxesWrapper.length)
                        $boxesWrapper = $wrapper.appendTo("body");

                var $infoBox = $('.draggable-data-box');
                if (opt.showCoordinates === true) {
                    if (!$infoBox.length)
                        $infoBox = $(opt.coordinatesContainer).appendTo($boxesWrapper);
                }

                var $cssInfoBox = $('.draggable-css-data-box');
                if (opt.showCssBox === true) {
                    if (!$cssInfoBox.length)
                        $cssInfoBox = $(opt.cssContainer).appendTo($boxesWrapper);
                }

                if (!$selected.data("css-id"))
                    $selected.data("css-id", uuid.v4());

                var top = $selected.css("top");
                var left = $selected.css("left");

                if (opt.showCoordinates === true && $infoBox.length) {
                    var tooltipContent = "left: " + left + "; " + "top: " + top + ";";

                    if (opt.showIdAttr === true && idAttr) {
                        tooltipContent = "<div class='draggable-data-box-title'>ID: " + idAttr + "</div>" + tooltipContent
                    }

                    if (opt.showClassAttr === true) {
                        tooltipContent = "<div class='draggable-data-box-title'>CLASS: " + classAttr + "</div>" + tooltipContent
                    }

                    if (opt.showTooltip) {
                        $(".draggable-info").html(tooltipContent);
                    }

                    $infoBox.html(tooltipContent);
                }

                if (opt.showCssBox === true && $cssInfoBox.length) {
                    var css = (idAttr && opt.showIdAttr ? "#" + idAttr : "") + (classAttr && opt.showClassAttr  ? classAttr : "") + " { " +
                        "left: " + left + "; " + "top: " + top + ";";

                    if (opt.isResizable)
                        css = css + " width: " + $selected.width() + "px; " + "height: " + $selected.height() + "px;";

                    css = css + " }";

                    var crossCssDictionary = $crossCssContainer.data("dict") || {};
                    crossCssDictionary[$selected.data("css-id")] = css;

                    $crossCssContainer.data("dict", crossCssDictionary);

                    var cssContent = "";

                    for (var element in crossCssDictionary)
                        if (crossCssDictionary.hasOwnProperty(element)) {
                            cssContent = cssContent + crossCssDictionary[element] + "<br />";
                        }

                    $cssInfoBox.html(cssContent);
                }
            };

            $elements.focusin(function () {
                $(this).bind('keydown', 'up', function (e) {
                    var topp = $selected.offset().top;
                    var leftt = $selected.offset().left;

                    $selected.offset({
                            top: topp - 1,
                            left: leftt
                        });

                    updateInfoBoxes();

                });
                $(this).bind('keydown', 'down', function (e) {
                    var topp = $selected.offset().top;
                    var leftt = $selected.offset().left;

                    $selected.offset({
                            top: topp + 1,
                            left: leftt
                        });

                    updateInfoBoxes();
                });
                $(this).bind('keydown', 'left', function (e) {
                    var topp = $selected.offset().top;
                    var leftt = $selected.offset().left;

                    $selected.offset({
                            top: topp,
                            left: leftt - 1
                        });

                    updateInfoBoxes();
                });
                $(this).bind('keydown', 'right', function (e) {
                    var topp = $selected.offset().top;
                    var leftt = $selected.offset().left;

                    $selected.offset({
                            top: topp,
                            left: leftt + 1
                        });

                    updateInfoBoxes();
                });
            });

            $elements.focusout(function () {
                $(this).unbind("keydown");
            });

            $elements.css('cursor', opt.cursor).on("mousedown", function (e) {
                $(this).focus();

                if (opt.handle === "") {
                    $selected = $(this);
                    $selected.addClass(opt.draggableClass);
                    $selected.css("z-index", opt.activeIndex);
                } else {
                    $selected = $(this).parent();
                    $selected.addClass(opt.draggableClass).find(opt.handle).addClass(opt.activeHandleClass);
                }

                // Get the position information about the selected element
                var drg_h = $selected.outerHeight(),
                    drg_w = $selected.outerWidth(),
                    pos_y = $selected.offset().top + drg_h - e.pageY,
                    pos_x = $selected.offset().left + drg_w - e.pageX;
                   
                if (opt.showTooltip === true) {
                    $selected.prepend(opt.tooltipContainer);
                }

                $selected.data("isResizingStart", resizableHandle && e.target === $(resizableHandle)[0]);

                $(document).on("mousemove", function (e) {
                    var isResizingStart = $selected.data("isResizingStart");

                    if (!isResizingStart)
                        $selected.offset({
                            top: e.pageY + pos_y - drg_h,
                            left: e.pageX + pos_x - drg_w
                        });

                    updateInfoBoxes();
                }).on("mouseup", function () {
                    $(this).off("mousemove"); // Unbind events from document
                    if ($selected !== null) {

                        $selected.removeClass(opt.draggableClass);

                        if (opt.showTooltip) { $(".draggable-info").remove(); }
                    }
                });

                e.preventDefault(); // disable selection

            }).on("mouseup", function () {
                if ($selected !== null) {
                    if (opt.handle === "") {
                        $selected.removeClass(opt.draggableClass);
                    } else {
                        $selected.removeClass(opt.draggableClass)
                            .find(opt.handle).removeClass(opt.activeHandleClass);
                    }
                    $selected.css("z-index", "");
                    $(".draggable-info").remove();
                }
            });

            return this;

        },

        destroy: function () {
            var opt = this.data('dragoptions');
            var $elements = (opt === undefined || opt.handle === "") ? this : this.find(opt.handle);

            if ($elements.length === 0)
                return;

            $elements.css('cursor', '');

            $elements.off("mousedown");
            $elements.off("mouseup");
            $elements.off("mousemove");

            if ($('#crossCssContainer').length)
                $('#crossCssContainer').remove();

            if ($('.draggable-data-box').length)
                $('.draggable-data-box').remove();

            if ($('.draggable-css-data-box').length)
                $('.draggable-css-data-box').remove();

            if ($('.draggable-data-box-wrapper').length)
                $('.draggable-data-box-wrapper').remove();

        }
    };

    $.fn.draggable = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to "init"
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.tooltip');
        }
    };
})(jQuery);
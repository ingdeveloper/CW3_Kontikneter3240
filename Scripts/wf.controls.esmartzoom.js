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
(function ($) {

    $.fn.jviewBox = function (options) {

                var settings = $.extend({
                    'transformOrigin': 'left top',
                    'width': 0,
                    'height': 0
                }, options);

                var targetElement = this;
                var parentElement = this.parent();


                //setup Container
                var zoomContainerId = "viewBox" + new Date().getTime();
                var containerDiv = $('<div id="' + zoomContainerId + '"></div>');
                targetElement.append(containerDiv);
                containerDiv.append(targetElement.children());

                var containerWidth = settings.width !== 0 ? settings.width : containerDiv.width();
                var containerHeight = settings.height !== 0 ? settings.width : containerDiv.height();

                var cssObject = new Object();
                cssObject["transform-origin"] = settings.transformOrigin;
                cssObject["display"] = "table";
                cssObject["width"] = containerWidth + "px";
                cssObject["height"] = containerHeight + "px";
                containerDiv.css(cssObject);

                //scale on start
                var scale = Math.min(targetElement.width() / containerDiv.width(), targetElement.height() / containerDiv.height());
                var cssObject = new Object();
                cssObject["transform"] = "scale(" + scale + ")";
                containerDiv.css(cssObject);


                // save for the listener data on the object
                targetElement.data("meta", {
                    targetElement: targetElement,
                    parentElement: parentElement,
                    containerDiv: containerDiv,
                    containerDivHeight: containerHeight,
                    containerDivWidth: containerWidth,
                });


                $(window).resize(function () {
                    var data = targetElement.data("meta");
                    var scale = Math.min(targetElement.width() / containerDiv.width(), targetElement.height() / containerDiv.height());
                    // give element css prop
                    var cssObject = new Object();
                    cssObject["transform"] = "scale(" + scale + ")";
                    containerDiv.css(cssObject);
                });
    }
}(jQuery));
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


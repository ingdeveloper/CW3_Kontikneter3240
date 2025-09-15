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
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
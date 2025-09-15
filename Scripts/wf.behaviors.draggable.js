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
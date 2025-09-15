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
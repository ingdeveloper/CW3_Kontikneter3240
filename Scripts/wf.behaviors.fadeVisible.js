// Knockout binding handler that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
// Optional parameters: @duration

ko.bindingHandlers.fadeVisible = {
    init: function (element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value));
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        var duration = allBindingsAccessor.fadeDuration || 500;
        ko.unwrap(value) ? $(element).fadeIn(duration) : $(element).fadeOut(duration);
    }
};
// Knockout binding handler that makes text fadein on change
// Optional parameter: @duration

ko.bindingHandlers.fadeInText = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        var duration = allBindingsAccessor.fadeDuration || 500;
        $(element).hide();
        ko.bindingHandlers.text.update(element, valueAccessor);
        $(element).fadeIn(duration);
    }
};
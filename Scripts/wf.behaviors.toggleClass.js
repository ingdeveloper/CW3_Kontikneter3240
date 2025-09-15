// KO binding handlers for toggle css class(es) on an element based on jQuery toggleClass
ko.bindingHandlers.toggleClass = {
    update: function (element, valueAccessor) {
        var cssClass = ko.unwrap(valueAccessor());
        var $element = $(element);

        $element.click(function () {
            $element.toggleClass(cssClass);
        });
    }
};
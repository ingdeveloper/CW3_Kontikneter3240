ko.bindingHandlers.addAuthorizationClass = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        var valueUnwrapped = ko.unwrap(value);
        var cssClass = "has-no-authorization";
        var parentIndex = 1
        var hasNoAuthorization = null;

        if (allBindings.has("hasNoAuthorization")) {
            hasNoAuthorization = ko.unwrap(allBindings.get("hasNoAuthorization"));
        }
        if (allBindings.has("parentIndex")) {
            parentIndex = ko.unwrap(allBindings.get("parentIndex"));
        }

        if (hasNoAuthorization === null)
            return;

        parentIndex = parentIndex !== undefined ? parentIndex : 1;

        var container = $(element).parents()[parentIndex];

        if (!container)
            return;

        container = $(container);

        var id = container.attr('id');
        var position = container.css('position');
        var div = container.is("div");

        if (id && position === "absolute" && div)
            hasNoAuthorization ? container.addClass(cssClass) : container.removeClass(cssClass);
    }
};

ko.virtualElements.allowedBindings.addAuthorizationClass = true;
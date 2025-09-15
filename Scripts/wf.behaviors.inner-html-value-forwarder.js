ko.bindingHandlers.innerHtmlValueFowarder = {
    update: function(element, valueAccessor) {
        var data = element.innerHTML;
        var accessor = valueAccessor();
        if(accessor)accessor(data);
    }
}
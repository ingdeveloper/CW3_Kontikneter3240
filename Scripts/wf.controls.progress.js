// Knockout binding handler Bootstrap Progress
// Source: https://github.com/billpull/knockout-bootstrap

ko.bindingHandlers.progress = {
    counter: 0,
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $element = $(element);
        var cssClass = allBindingsAccessor().cssClass || "";
        var orientation = allBindingsAccessor().orientation || "horizontal";
        
        var guid = "__pb__" + (++ko.bindingHandlers.progress.counter);

        var bar = $('<div/>',
            {
                'class': "progress-bar wf-progress-state",
                'data-bind': "css:" + cssClass + ", " +
                "style: { " + (orientation.indexOf("vertical") > -1 ? "height" : "width") + ": " + valueAccessor() + "}"
            });

        $element.attr('id', guid)
            .addClass('progress')
            .append(bar);
    }
};
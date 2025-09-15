ko.bindingHandlers.modalDialog = {
    init: function (element, valueAccessor) {

        var properties = valueAccessor();

        if (!properties) return;

        var appendToBody = properties.appendToBody !== undefined ? ko.unwrap(properties.appendToBody) : true;
        var draggable = properties.draggable !== undefined ? ko.unwrap(properties.draggable) : true;
        var draggableHandle = properties.draggableHandle !== undefined ? ko.unwrap(properties.draggableHandle) : ".modal-header";

        if (appendToBody)
            $(element).appendTo("body");
        
        if (draggable)
            $(element).draggable({
                    showCoordinates: false,
                    showTooltip: false,
                    handle: draggableHandle
                });

        $(element).modal({
                show: false
            });

        if (typeof properties.show === 'function') {
            $(element).on('hide.bs.modal', function () {
                properties.show(false);
            });
        }

        
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).data('bs.modal', null).remove();
        });
    },

    update: function (element, valueAccessor) {
        var value = valueAccessor();
        var show = value.show !== undefined ? value.show : value();

        if (ko.utils.unwrapObservable(show)) {
            $(element).modal('show');
        } else {
            $(element).modal('hide');
        }
    }
}
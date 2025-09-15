// Knockout binding handler for Bootstrap date time picker
// bindingContext.$data.isEdited is used to make the editing from the textbox and picker not overstep on each other

ko.bindingHandlers.colorpicker = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        $(element).colorpicker();

        var colorPicker = valueAccessor();
        var disabled = colorPicker && colorPicker.disabled && ko.unwrap(colorPicker.disabled) ? 'disable' : 'enable';

        $(element).colorpicker(disabled);

        ko.utils.domNodeDisposal.addDisposeCallback(element,
            function () {
                $(element).colorpicker('destroy');
            });

        var debounced = _.debounce(function () {
            var color = "#000000";
            var colorPicker = valueAccessor();
            var colorConvert = ko.unwrap(colorPicker.colorConvert) !== undefined ? ko.unwrap(colorPicker.colorConvert) : 0;

            if (colorConvert === 0) {
                color = $(element).data("colorpicker").color.toHex();
            }
            if (colorConvert === 1) {
                color = $(element).data("colorpicker").color.toString();
            }

            if (ko.isObservable(colorPicker.selectedColor)) {
                if ((color === "#aN" || (color.indexOf("undefined") != -1) || (color.indexOf("NaN") != -1)) && colorConvert === 1) {
                    color = null;
                }
                colorPicker.selectedColor(color);
            }
        }, 100, true);


        //when a user changes the date, update the view model
        $(element).on("changeColor", debounced);
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var colorPicker = valueAccessor();

        var selectedValue = colorPicker && colorPicker.selectedColor ? ko.unwrap(colorPicker.selectedColor) : "#000000";
        $(element).colorpicker('setValue', selectedValue);

        var disabled = colorPicker && colorPicker.disabled && ko.unwrap(colorPicker.disabled) ? 'disable' : 'enable';
        $(element).colorpicker(disabled);

    }
};
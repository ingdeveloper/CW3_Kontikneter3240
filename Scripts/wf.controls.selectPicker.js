// Knockout binding handler for Bootstrap select picker
ko.bindingHandlers.selectpicker = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var picker = valueAccessor();

        //#region Set options
        var option = {};

        if (picker.size && ko.unwrap(picker.size))
            option.size = ko.unwrap(picker.size);

        if (picker.optionsTitle && ko.unwrap(picker.optionsTitle) !== undefined)
            option.title = ko.unwrap(picker.optionsTitle);

        if (picker.liveSearch && ko.unwrap(picker.liveSearch) !== undefined)
            option.liveSearch = ko.unwrap(picker.liveSearch);

        if (picker.width && ko.unwrap(picker.width) !== undefined)
            option.width = ko.unwrap(picker.width);

        if (picker.header && ko.unwrap(picker.header) !== undefined)
            option.header = ko.unwrap(picker.header);

        if (picker.style && ko.unwrap(picker.style) !== undefined)
            option.style = ko.unwrap(picker.style);

        //#endregion

        $(element).addClass('selectpicker').selectpicker(option);

        if (option.style)
            $(element).selectpicker('setStyle', option.style, 'add');

        if (picker.options) {
            options = ko.isObservable(picker.options) ? picker.options : ko.observableArray(picker.options);
            ko.bindingHandlers.options.init(element, options, allBindingsAccessor);
        }

        $(element).on('hidden.bs.select', function (e) {
            var selectedValues = [];

            $(this).find("option:selected").each(function (i, selected) {
                selectedValues[i] = $(selected).val();
            });

            var evt = $.Event('selectchanged');
            evt.selectedValues = selectedValues;

            $(this).trigger(evt);

            if (picker.selectedOptions && ko.isObservable(picker.selectedOptions)) {
                picker.selectedOptions.valueWillMutate();
                var isArray = $.isArray(ko.utils.unwrapObservable(picker.selectedOptions()));
                if (isArray)
                    picker.selectedOptions([]);

                for (var i = 0; i < selectedValues.length; i++)
                    isArray ? picker.selectedOptions.push(selectedValues[i]) : picker.selectedOptions(selectedValues[i]);
                picker.selectedOptions.valueHasMutated();
            }
        });
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        var picker = valueAccessor();
        var isDisabled = picker.disabled ? ko.unwrap(picker.disabled) : false;

        if (picker.options) {
            options = ko.isObservable(picker.options) ? picker.options : ko.observableArray(picker.options);
            ko.bindingHandlers.options.update(element, options, allBindingsAccessor);
        }

        $(element).prop('disabled', isDisabled);

        $(element).selectpicker('refresh');

        if (ko.unwrap(picker.selectedOptions) && ko.isObservable(picker.selectedOptions) && $(element).prop('multiple') && $.isArray(ko.utils.unwrapObservable(picker.selectedOptions()))) {
            // in the case of a multiple select where the valueAccessor() is an observableArray, call the default Knockout selectedOptions binding
            ko.bindingHandlers.selectedOptions.init(element, picker.selectedOptions, allBindingsAccessor);
        }
        else
            $(element).selectpicker('val', ko.unwrap(picker.selectedOptions));

    }
};
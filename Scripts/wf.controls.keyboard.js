// Knockout binding handler for Virtual Keyboard
//https://github.com/Mottie/Keyboard

ko.bindingHandlers.keyboard = {
    init: function (element, valueAccessor, allBindingsAccessor) {

        if (!window ||
            !window.clientConfiguration ||
            !window.clientConfiguration.useVirtualKeyboard) {
            return;
        }

        var keyboardType = valueAccessor() && valueAccessor().toString().toLowerCase().startsWith('alpha') ? 'alpha' : 'num';

        $(element).keyboard({
            layout: keyboardType,
            usePreview: true, // disabled for contenteditable
            useCombos: false,
            autoAccept: true,
            language: window.clientConfiguration.languageCode
        });

        $(element).focus(function() {
            var keyboard = $(element).getkeyboard();

            if (keyboard.language !== window.clientConfiguration.languageCode) {
                keyboard.language = window.clientConfiguration.languageCode;
                keyboard.redraw();
            }
        });
    }
};
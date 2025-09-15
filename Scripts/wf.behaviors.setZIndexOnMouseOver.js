ko.bindingHandlers.setZIndexOnMouseOver = {
    init: function (element, valueAccessor, allBindings) {

        var data = ko.unwrap(valueAccessor());
        var newIndex = ko.unwrap(data.zIndex)|| 10000;
        var applyParentZIndex = ko.unwrap(data.applyParentZIndex) !== undefined ? ko.unwrap(data.applyParentZIndex) : true;

        var currentIndex = $(element).css("z-index") || '';
        var parentCurrentIndex = $(element).parent().css("z-index") || '';

        ko.utils.domData.set(element, "newIndex", newIndex);
        ko.utils.domData.set(element, "currentIndex", currentIndex);
        ko.utils.domData.set(element, "parentCurrentIndex", parentCurrentIndex);
        ko.utils.domData.set(element, "applyParentZIndex", applyParentZIndex);

        $(element).mouseover(function () {
            var index = ko.utils.domData.get(element, 'newIndex');
            var withParent = ko.utils.domData.get(element, 'applyParentZIndex');

            $(this).css("z-index", index);
            if (withParent)
                $(this).parent().css("z-index", index);
        });

        $(element).mouseout(function () {
            var elementIndex = ko.utils.domData.get(element, 'currentIndex');
            var parentIndex = ko.utils.domData.get(element, 'parentCurrentIndex');
            var withParent = ko.utils.domData.get(element, 'applyParentZIndex');

            $(this).css("z-index", elementIndex);
            if (withParent)
                $(this).parent().css("z-index", parentIndex);
        });
    },

    update: function (element, valueAccessor, allBindings) {

        var data = ko.unwrap(valueAccessor());
        var newIndex = ko.unwrap(data.zIndex) || 10000;
        var applyParentZIndex = ko.unwrap(data.applyParentZIndex) !== undefined ? ko.unwrap(data.applyParentZIndex) : true;

        var currentIndex = $(element).css("z-index") || '';
        var parentCurrentIndex = $(element).parent().css("z-index") || '';

        ko.utils.domData.set(element, "newIndex", newIndex);
        ko.utils.domData.set(element, "currentIndex", currentIndex);
        ko.utils.domData.set(element, "parentCurrentIndex", parentCurrentIndex);
        ko.utils.domData.set(element, "applyParentZIndex", applyParentZIndex);
    }
};
// Experimental custom KO binding handler for setting random offset position of the assigned item
// Example: <div data-bind="randomPosition: {topMin: 20,  topMax: 200, leftMin: 10,  leftMax: 200,}"></div>

ko.bindingHandlers.randomPosition = {
        init: function (element, valueAccessor) {
            var options = valueAccessor();
            var topMin = ko.unwrap(options.topMin) || 1;
            var topMax = ko.unwrap(options.topMax) || 300;
            var leftMin = ko.unwrap(options.leftMin) || 1;
            var leftMax = ko.unwrap(options.leftMax) || 300;

            $element = $(element);
            $element.draggable(options);

            $element.css("left", Math.floor(Math.random() * (leftMax - leftMin + 1)) + leftMin);
            $element.css("top", Math.floor(Math.random() * (topMax - topMin + 1)) + topMin);
        }
    };

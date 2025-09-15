/**
 * Hide element when it is empty
 * eg. <div data-bind="hideIfEmpty: {}"/>
 */
ko.bindingHandlers.hideIfEmpty = {
	update: function (element) {
		if ($(element).is(":empty") || !$.trim($(element).text()).length) {
		    $(element).css("display", "none");
		}
	}
};
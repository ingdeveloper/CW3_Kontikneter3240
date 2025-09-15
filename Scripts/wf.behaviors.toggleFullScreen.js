/**
* This is binding handler open browser in full screen mode by click on element
* Don't work in IE
* eg. <i class="wf wf-fullscreen" data-bind="toggleFullScreen: {}"/>
*/
ko.bindingHandlers.toggleFullScreen = {
    init: function (element) {
        if (fullScreenApi.supportsFullScreen) {
            element.addEventListener('click', function () {

                if (!fullScreenApi.isFullScreen()) {
                    fullScreenApi.requestFullScreen(document.documentElement);
                } else {
                    fullScreenApi.cancelFullScreen(document.documentElement);
                }
            }, { passive: true, capture: true });
        }
    }
};
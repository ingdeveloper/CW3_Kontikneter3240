ko.bindingHandlers.fixTableHeader = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            if (valueAccessor().wrapperId)
                document.getElementById(valueAccessor().wrapperId).addEventListener("scroll", function () {
                    $(this).find("thead").css({
                            '-webkit-transform': 'translate(0,' + this.scrollTop + 'px)',
                            '-moz-transform': 'translate(0,' + this.scrollTop + 'px)',
                            '-ms-transform': 'translate(0,' + this.scrollTop + 'px)',
                            '-o-transform': 'translate(0,' + this.scrollTop + 'px)',
                            'transform': 'translate(0,' + this.scrollTop + 'px)'
                        });
                }, { passive: true });
        },
    };

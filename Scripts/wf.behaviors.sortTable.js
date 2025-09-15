ko.bindingHandlers.sortTable = {
    init: function (element, valueAccessor) {

        var options = valueAccessor();

        var ascIcon = options.ascIcon || "wf wf-shape-triangle";
        var descIcon = options.descIcon || "wf wf-shape-triangle wf-w";
        var iconCssClass = options.iconCssClass || "";
        var excludeColumnIndexs = options.excludeColumnIndexs || [];

        if (!options.sortFunction || typeof (options.sortFunction) !== 'function') return;

        $(element).on("click", "th", function (event) {
            var th = event.currentTarget,
                sort = $(th).data("sort"),
                asc = true;

            if (excludeColumnIndexs.indexOf($(th).index()) !== -1) return;

            if (sort)
                asc = sort === "asc" ? false : true; // revert

            options.sortFunction($(th).index(), asc);

            //remove all sort attr and icons
            $(element).find('thead th').each(function (index, th) {
                $(th).removeData("sort");
                $(th).find("span.sortIcon").remove();
            });

            //set attr
            $(th).data("sort", asc ? "asc" : "desc");
            //add icon
            var span = $("<span/>");
            $(span).addClass(iconCssClass);
            $(span).addClass(asc ? ascIcon : descIcon);
            $(span).addClass("sortIcon");
            $(span).appendTo($(th));
        });
    },
};

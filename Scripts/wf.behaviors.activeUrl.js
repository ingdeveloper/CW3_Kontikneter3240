function absolute(base, relative) {
    if (relative.indexOf(".") === -1 && relative.indexOf("..") === -1) {
        var a = document.createElement('a');
        a.href = relative;
        return a.href;
    }

    var stack = base.split("/"),
        parts = relative.split("/");
    stack.pop(); // remove current file name (or empty string)
    // (omit if "base" is the current folder without trailing slash)
    for (var i = 0; i < parts.length; i++) {
        if (parts[i] == ".")
            continue;
        if (parts[i] == "..")
            stack.pop();
        else
            stack.push(parts[i]);
    }
    return stack.join("/");
}

/**
 * The element where this binding will be applied to, get at runtime a class active if the related document is opened.
 * @param {string} url - the relative path to a HTML page.
 * eg. <div data-bind="activeUrl: {url: '#widgets' }"/>
 */

ko.bindingHandlers.activeUrl = {
    init: function (element, valueAccessor) {
        var url = valueAccessor().url || null;
        url = ko.unwrap(url) || element.getAttribute("data-wf-activeUrl");
        if (!url || !url.trim())
            return;

        url = absolute(document.location.href, url.trim());

        if (url === window.location.href)
            $(element).addClass("active");
    }
};
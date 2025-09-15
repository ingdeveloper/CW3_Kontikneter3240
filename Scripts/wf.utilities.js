var wf = wf || {};
wf.utilities = (function () {
    String.prototype.replaceAll = function (search, replace) {
        if (replace === undefined) {
            return this.toString();
        }
        return this.split(search).join(replace);
    };

    function ResolvePagePlaceholders(animatedClass, animatedClassApplyDuration) {
        var searchString = window.location.search.substring(1);
        var defaultNavigationParameterPlaceholder = document.getElementById("defaultNavigationParameters"); //search special div with id. The Value should be JSON with default parameters. {"ParameterName":"ParameterValue"}
        var beforeApply = function () {
            if (animatedClass)
                $(document.body).addClass(animatedClass);
        };

        var afterApply = function () {
            if (animatedClass && animatedClassApplyDuration)
                var timer = setTimeout(function () {
                    $(document.body).removeClass(animatedClass);
                    clearTimeout(timer);
                },
                    animatedClassApplyDuration);
        };

        document.body.innerHTML = resolvePlaceholders(defaultNavigationParameterPlaceholder, searchString, document.body.innerHTML, beforeApply, afterApply);
    }

    function ResolveStringPlaceholders(url, content) {
        var searchString = url.split("?")[1];
        var $wrap = $("<div/>").html(content);
        var defaultNavigationParameterPlaceholder = $wrap.find("#defaultNavigationParameters").first();
        defaultNavigationParameterPlaceholder = defaultNavigationParameterPlaceholder ? defaultNavigationParameterPlaceholder : null;

        return resolvePlaceholders(defaultNavigationParameterPlaceholder, searchString, content);
    }

    function resolvePlaceholders(defaultNavigationParameterPlaceholder, searchString, content, beforApplyCallback, afterApplyCallback) {
        var defaultNavigationParameters = parseNavigationPlaceholder(defaultNavigationParameterPlaceholder);
        var queryStringParameters = getQueryStringParameters(searchString);

        if (!queryStringParameters && !defaultNavigationParameters)
            return content;

        queryStringParameters = queryStringParameters ? queryStringParameters : {};

        addParametersFromDefaultToNonExistingQueryStringParameters(queryStringParameters, defaultNavigationParameters);

        if (Object.keys(queryStringParameters).length > 0) {
            if (beforApplyCallback && typeof beforApplyCallback === "function")
                beforApplyCallback();

            for (var property in queryStringParameters) {
                if (queryStringParameters.hasOwnProperty(property)) {
                    content = content.replaceAll("[PC:" + property + "]", queryStringParameters[property]);
                }
            }

            if (afterApplyCallback && typeof afterApplyCallback === "function")
                afterApplyCallback();
        }

        return content;

    }

    function getQueryStringParameters(queryString) {
        if (!queryString || queryString.length === 0)
            return null;

        var params = {};

        var queryStringParameters = queryString.split("&");

        //create object from url parameters
        for (var i = 0; i < queryStringParameters.length; i++) {
            var keyValuePair = queryStringParameters[i].split("=");

            if (!keyValuePair[0].trim())
                continue;

            var key = decodeURIComponent(keyValuePair[0]);
            var value = decodeURIComponent(keyValuePair[1]);

            params[key] = value;
        }

        return params;
    }

    function parseNavigationPlaceholder(placeholder) {

        if (!placeholder)
            return null;

        try {
            return $.parseJSON(placeholder.textContent);
        } catch (e) {
            return null;
        }
    }

    function addParametersFromDefaultToNonExistingQueryStringParameters(queryStringParameters, defaultNavigationParameters) {
        if (!defaultNavigationParameters)
            return;

        for (var property in defaultNavigationParameters) {
            if (defaultNavigationParameters.hasOwnProperty(property)) {
                if (!queryStringParameters[property])
                    queryStringParameters[property] = defaultNavigationParameters[property];
            }
        }
    }

    function initializeConstants(configuration) {
        var config = configuration || {};
        var version = config.version || "3.x.x.x";
        var remoteIISServerUrl = config.remoteIISServerUrl;
        window.i4InstallationUrl = config.i4BaseUrl || "http://localhost:33668";
        window.i4PostfixInstallationUrl = config.i4PostfixUrl || "api/v2";
        window.usei4Connector = config.usei4Connector || false;
        window.disableSignalBrowser = config.disableSignalBrowser || false;
        window.shouldCheckClientSession = config.shouldCheckClientSession !== undefined ? config.shouldCheckClientSession : true;
        window.draggableDialogs = config.draggableDialogs !== undefined ? config.draggableDialogs : false;

        window.clientConfiguration = window.clientConfiguration || {
            useVirtualKeyboard: false,
            languageCode: "en",
            updateRate: 500
        };

        window.clientConfiguration.updateRate = config.updateRate !== undefined ? config.updateRate : window.clientConfiguration.updateRate;

        window.debounceIntervalResolvingSignalDefinitions = config.debounceIntervalResolvingSignalDefinitions !== undefined ? config.debounceIntervalResolvingSignalDefinitions : window.debounceIntervalResolvingSignalDefinitions !== undefined ? window.debounceIntervalResolvingSignalDefinitions : 10;
        window.debounceIntervalResolvingOfSignalIds = config.debounceIntervalResolvingOfSignalIds !== undefined ? config.debounceIntervalResolvingOfSignalIds : window.debounceIntervalResolvingOfSignalIds !== undefined ? window.debounceIntervalResolvingOfSignalIds : 10;
        window.debounceIntervalSubscribeToSignalChangeEvents = config.debounceIntervalSubscribeToSignalChangeEvents !== undefined ? config.debounceIntervalSubscribeToSignalChangeEvents : window.debounceIntervalSubscribeToSignalChangeEvents !== undefined ? window.debounceIntervalSubscribeToSignalChangeEvents : 10;

        var urlPath = window.document.location.href;
        var remoteIISServer = remoteIISServerUrl !== undefined && remoteIISServerUrl ?
            remoteIISServerUrl :
            window.document.location.hostname;

        if (!window.location.origin) {
            window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        }

        window.i4InstallationUrl = window.document.location.origin.replace(window.document.location.hostname, i4InstallationUrl);
        window.signalRUrl = window.i4InstallationUrl + "/signalr/hubs";

        window.rootUrl = urlPath;
        window.rootUrlPrefix = window.document.location.origin.replace(window.document.location.hostname, remoteIISServer);

        if (document.location.port && config.remoteIISServerPort) {
            window.rootUrl = window.rootUrl.replace(document.location.port, config.remoteIISServerPort);
            window.rootUrlPrefix = window.rootUrlPrefix.replace(document.location.port, config.remoteIISServerPort);
        }

        if (document.location.protocol && config.remoteIISServerProtocol) {
            var remoteIISServerProtocol = config.remoteIISServerProtocol.endsWith(":") ? config.remoteIISServerProtocol : config.remoteIISServerProtocol + ":";

            window.rootUrl = window.rootUrl.replace(document.location.protocol, remoteIISServerProtocol);
            window.rootUrlPrefix = window.rootUrlPrefix.replace(document.location.protocol, remoteIISServerProtocol);
        }

        window.appVersion = (version || "").replace("-", ".");
        window.defaultTimeZone = "UTC";

        window.resolveUrl = function (rootedUrl) {
            if (!rootedUrl) {
                return rootedUrl;
            }

            //  ~/_Services/WebServices/WCF/AlarmsService.svc
            if (rootedUrl.substring(0, 2) === "~/") {
                return rootedUrl.replace("~/", window.rootUrlPrefix + "/");
            }

            //  /_Services/WebServices/WCF/AlarmsService.svc
            if (rootedUrl.substring(0, 1) === "/") {
                return window.rootUrlPrefix + rootedUrl;
            }

            //  http://localhost/_Services/WebServices/WCF/AlarmsService.svc
            return rootedUrl.replace(window.document.location.hostName, remoteIISServer);
        };

        window.resolveHeaders = function (headers) {
            if (config.customHeaders) {
                return config.customHeaders;
            }

            if (!headers) {
                headers = {};
            }

            //headers["cache-control"] = "no-cache";
            return headers;
        };
    }

    function initializeModalLoading() {

        var draggable = window.draggableDialogs ? "data-bind=\"draggable:{showCoordinates: false, isActive: true, handle: '.modal-header'}\"" : "";

        document.body.insertAdjacentHTML('beforeend',
            "<div id='wfModal' class='modal fade' style='display: none;'" + draggable + "> <div class='modal-dialog'> <div class='modal-content' style='overflow-x: hidden;'> <div class='modal-header'> <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button> <div class='modal-title'>Test draggable</div> </div> <div class='modal-body p-a-0'></div> <div class='modal-footer'> <button type='button' class='btn btn-primary' data-dismiss='modal'> <i class='wf wf-small-x-round-o m-r-sm'></i> <wf-symbolictext params='symbolicText: \"I4SCADA_Close\"'></wf-symbolictext> </button> </div> </div> </div> </div>");

        $(document).ready(function () {
            $('#wfModal')
                .on('hidden.bs.modal',
                    function (event) {
                        var modal = $(this);
                        var modalBodyContent = $('#wf-modal-content')[0];

                        // Clean Knockput bindings and clear modal dialog body container
                        if (modalBodyContent) {
                            ko.cleanNode(modalBodyContent);
                        }
                        modal.find('.modal-body').empty();

                        // Remove the added class names on the modal dialog container  beside the default name
                        modal.find('.modal-dialog').removeClass().addClass('modal-dialog');
                        modal.find('.modal-header').removeClass().addClass('modal-header');

                        // workaround to delete backdrops with are not related to a modal dialog
                        removeNotNeededBackdrops();
                    });

            $('#wfModal')
                .on('show.bs.modal',
                    function (event) {
                        var modal = $(this);

                        var button = $(event.relatedTarget); // Element that triggered the modal
                        var src = button.data('src'); // Extract info from data-* attributes
                        var placement = button.data('placement') || "center";
                        var bodyHeight = button.data('height');
                        var bodyWidth = button.data('width');
                        var title = button.data('title') || "";
                        var className = button.data('class') + " modal-" + placement;
                        var headerClass = button.data('header-class');
                        var localSrc = button.data('local-src');
                        //modal.find('.modal-dialog').removeClass('modal-md modal-sm modal-lg').addClass(size);

                        var objectID = null;
                        try {
                            var params = button.attr("params");
                            eval("var result ={" + params + "}");
                            objectID = result ? result.hasOwnProperty("objectID") ? result.objectID : null : null;
                        } catch (error) { }

                        modal.find('.modal-dialog').addClass(className);

                        if (title === "") {
                            modal.find('.modal-header').hide();
                        } else {
                            var resolvedTitle = title.stringPlaceholderResolver(objectID);
                            var $newWidget = $('<wf-symbolictext params="symbolicText:\'' + resolvedTitle + '\'"></wf-symbolictext>');
                            modal.find('.modal-title').html("").append($newWidget);

                            //Apply bindings 
                            if ($newWidget[0]) {
                                ko.cleanNode($newWidget[0]);
                                ko.applyBindings({}, $newWidget[0]);
                            }

                            modal.find('.modal-header').addClass(headerClass);
                            modal.find('.modal-header').show();
                        }

                        modal.find('.modal-dialog').css("width", bodyWidth);
                        modal.find('.modal-body').css("height", bodyHeight);
                        modal.find('.modal-body').css("width", bodyWidth);

                        if (src) {
                            src = src.stringPlaceholderResolver(objectID);
                            $.get(src, function (responseText) {
                                buildModal(responseText, modal, src, objectID);
                            });
                        } else if (localSrc) {
                            localSrc = localSrc.stringPlaceholderResolver(objectID);
                            var localContainer = document.getElementById("wf-local-modal-" + localSrc);
                            if (localContainer) {
                                buildModal(localContainer.innerHTML, modal, localSrc, objectID);
                            }
                        }
                        // workaround to delete backdrops with are not related to a modal dialog
                        removeNotNeededBackdrops();
                    });

            var hidden, visibilityChange;
            if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
                hidden = "hidden";
                visibilityChange = "visibilitychange";
            } else if (typeof (document).msHidden !== "undefined") {
                hidden = "msHidden";
                visibilityChange = "msvisibilitychange";
            } else if (typeof (document).webkitHidden !== "undefined") {
                hidden = "webkitHidden";
                visibilityChange = "webkitvisibilitychange";
            }
            if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
                console.warn("visibilitychange event is not supported");
            } else {
                // Handle page visibility change   
                document.addEventListener(visibilityChange, () => {
                    removeNotNeededBackdrops();
                });
            }
        });

        function buildModal(responseText, modal, src, objectID) {
            var $modalBody = modal.find('.modal-body');
            // Resolve parameter placeholders in loaded html
            responseText = wf.utilities.ResolveStringPlaceholders(src, responseText).stringPlaceholderResolver(objectID, false);
            $modalBody.append('<div id="wf-modal-content" class="stretched overflow-auto"></div>');
            var $modalBodyContent = modal.find('#wf-modal-content');
            // ToDo: Stip the HTML in order to inject only the content of the body and CSS references
            // console.log(responseText);
            $modalBodyContent.html(responseText);
            // Apply bindings in injected html
            if ($modalBodyContent[0]) {
                ko.cleanNode($modalBodyContent[0]);
                ko.applyBindings({}, $modalBodyContent[0]);
            }
        }

        function removeNotNeededBackdrops() {
            // workaround to delete backdrops with are not related to a modal dialog
            var backdrops = $("body").find(".modal-backdrop");
            for (let index = 0; index < backdrops.length; index++) {
                var element = backdrops[index];
                var events = $._data(element, "events");
                if (events == null) {
                    element.remove();
                }
            }
        }
    }

    function InitilizeConstants(version, remoteIISServerUrl, i4BaseUrl, usei4Connector, disableSignalBrowser) {
        initializeConstants({
            version: version,
            remoteIISServerUrl: remoteIISServerUrl,
            i4BaseUrl: i4BaseUrl,
            usei4Connector: usei4Connector,
            disableSignalBrowser: disableSignalBrowser
        });
    }

    function InitilizeModalLoading() {
        initializeModalLoading();
    }

    function replaceWfPopupInfoLayerParameter() {
        var layers = document.getElementsByClassName("wf-popup-info-layer");
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var objectID = layer.getAttribute("data-wf-object-ID");
            layer.innerHTML = layer.innerHTML.replaceAll("[ONID]", layer.getAttribute("data-wf-object-name-ID").stringPlaceholderResolver(objectID));
            layer.innerHTML = layer.innerHTML.replaceAll("[SP]", layer.getAttribute("data-wf-signal-prefix").stringPlaceholderResolver(objectID));
        }

        document.body.innerHTML = document.body.innerHTML;
    }

    return {
        ResolveStringPlaceholders: ResolveStringPlaceholders,
        ResolvePagePlaceholders: ResolvePagePlaceholders,
        initializeConstants: initializeConstants,
        initializeModalLoading: initializeModalLoading,
        replaceWfPopupInfoLayerParameter: replaceWfPopupInfoLayerParameter,
        //legacy
        InitilizeConstants: InitilizeConstants,
        InitilizeModalLoading: InitilizeModalLoading
    }
}());
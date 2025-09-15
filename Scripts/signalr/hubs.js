/*!
 * ASP.NET SignalR JavaScript Library v2.2.1
 * http://signalr.net/
 *
 * Copyright (c) .NET Foundation. All rights reserved.
 * Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
 *
 */

/// <reference path="..\..\SignalR.Client.JS\Scripts\jquery-1.6.4.js" />
/// <reference path="jquery.signalR.js" />
(function ($, window, undefined) {
    /// <param name="$" type="jQuery" />
    "use strict";

    if (typeof ($.signalR) !== "function") {
        throw new Error("SignalR: SignalR is not loaded. Please ensure jquery.signalR-x.js is referenced before ~/signalr/js.");
    }

    var signalR = $.signalR;

    function makeProxyCallback(hub, callback) {
        return function () {
            // Call the client hub method
            callback.apply(hub, $.makeArray(arguments));
        };
    }

    function registerHubProxies(instance, shouldSubscribe) {
        var key, hub, memberKey, memberValue, subscriptionMethod;

        for (key in instance) {
            if (instance.hasOwnProperty(key)) {
                hub = instance[key];

                if (!(hub.hubName)) {
                    // Not a client hub
                    continue;
                }

                if (shouldSubscribe) {
                    // We want to subscribe to the hub events
                    subscriptionMethod = hub.on;
                } else {
                    // We want to unsubscribe from the hub events
                    subscriptionMethod = hub.off;
                }

                // Loop through all members on the hub and find client hub functions to subscribe/unsubscribe
                for (memberKey in hub.client) {
                    if (hub.client.hasOwnProperty(memberKey)) {
                        memberValue = hub.client[memberKey];

                        if (!$.isFunction(memberValue)) {
                            // Not a client hub function
                            continue;
                        }

                        subscriptionMethod.call(hub, memberKey, makeProxyCallback(hub, memberValue));
                    }
                }
            }
        }
    }

    $.hubConnection.prototype.createHubProxies = function () {
        var proxies = {};
        this.starting(function () {
            // Register the hub proxies as subscribed
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, true);

            this._registerSubscribedHubs();
        }).disconnected(function () {
            // Unsubscribe all hub proxies when we "disconnect".  This is to ensure that we do not re-add functional call backs.
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, false);
        });

        proxies['eventHub'] = this.createHubProxy('eventHub'); 
        proxies['eventHub'].client = { };
        proxies['eventHub'].server = {
            subscribe: function () {
                return proxies['eventHub'].invoke.apply(proxies['eventHub'], $.merge(["Subscribe"], $.makeArray(arguments)));
             },

            unsubscribe: function () {
                return proxies['eventHub'].invoke.apply(proxies['eventHub'], $.merge(["Unsubscribe"], $.makeArray(arguments)));
             }
        };

        proxies['historyHub'] = this.createHubProxy('historyHub'); 
        proxies['historyHub'].client = { };
        proxies['historyHub'].server = {
            subscribe: function (occurrenceId) {
                return proxies['historyHub'].invoke.apply(proxies['historyHub'], $.merge(["Subscribe"], $.makeArray(arguments)));
             },

            subscribeAll: function (occurrenceIds) {
                return proxies['historyHub'].invoke.apply(proxies['historyHub'], $.merge(["SubscribeAll"], $.makeArray(arguments)));
             },

            unsubscribe: function (occurrenceId) {
                return proxies['historyHub'].invoke.apply(proxies['historyHub'], $.merge(["Unsubscribe"], $.makeArray(arguments)));
             },

            unsubscribeAll: function (occurrenceIds) {
                return proxies['historyHub'].invoke.apply(proxies['historyHub'], $.merge(["UnsubscribeAll"], $.makeArray(arguments)));
             }
        };

        proxies['measurementHub'] = this.createHubProxy('measurementHub'); 
        proxies['measurementHub'].client = { };
        proxies['measurementHub'].server = {
            read: function (signalId) {
                return proxies['measurementHub'].invoke.apply(proxies['measurementHub'], $.merge(["Read"], $.makeArray(arguments)));
             },

            subscribe: function (signalId) {
                return proxies['measurementHub'].invoke.apply(proxies['measurementHub'], $.merge(["Subscribe"], $.makeArray(arguments)));
             },

            subscribeAll: function (signalIds) {
                return proxies['measurementHub'].invoke.apply(proxies['measurementHub'], $.merge(["SubscribeAll"], $.makeArray(arguments)));
             },

            unsubscribe: function (signalId) {
                return proxies['measurementHub'].invoke.apply(proxies['measurementHub'], $.merge(["Unsubscribe"], $.makeArray(arguments)));
             },

            unsubscribeAll: function (signalIds) {
                return proxies['measurementHub'].invoke.apply(proxies['measurementHub'], $.merge(["UnsubscribeAll"], $.makeArray(arguments)));
             }
        };

        proxies['messageHub'] = this.createHubProxy('messageHub'); 
        proxies['messageHub'].client = { };
        proxies['messageHub'].server = {
            subscribe: function (logLevel) {
                return proxies['messageHub'].invoke.apply(proxies['messageHub'], $.merge(["Subscribe"], $.makeArray(arguments)));
             },

            unsubscribe: function () {
                return proxies['messageHub'].invoke.apply(proxies['messageHub'], $.merge(["Unsubscribe"], $.makeArray(arguments)));
             }
        };

        return proxies;
    };

    signalR.hub = $.hubConnection("/signalr", { useDefaultPath: false });
    $.extend(signalR, signalR.hub.createHubProxies());

}(window.jQuery, window));
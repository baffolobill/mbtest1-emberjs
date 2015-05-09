import ENV from "mb-test-1/config/environment";
//import Ajax from "mb-test-1/lib/ajax";
//import Utils from "mb-test-1/lib/utils";
import BaseAdapter from "./base";
//import Auth from "mb-test-1/auth";

export default BaseAdapter.extend({
    host: function() {
        return ENV.APP.API_HOST;
    }.property(),

    namespace: function() {
        return ENV.APP.API_NAMESPACE;
    }.property(),

    _uri: function(type, uri) {
        this._checkParams(type, uri);

        /*var host = this.getHostForType(type);
        if (uri && uri.indexOf(host) !== 0 && uri.indexOf('https') !== 0) {
            uri = host + uri;
        }*/
        return uri;
    },

    find: function(store, type, id, snapshot) {
        var uri;
        if (id && String(id).charAt(0) === '/') {
            uri = this.completeURL(this._uri(type, id.substr(1)));
        } else {
            uri = this.buildURL(type.typeKey, id, snapshot);
        }
        return this.ajax(uri, 'GET');
    },
    /*get: function(type, uri, success, error) {
        var settings = {};
        settings.error = error;
        return this.ajax(this._uri(type, uri), 'GET', settings).then(function(json) {
            success(json);
        });
    },

    //createRecord: function(store, type, uri, snapshot) {
    create: function(type, uri, data, success, error, settings) {
        settings = settings || {};
        settings.data = data;
        settings.error = error;
        this.ajax(this._uri(type, uri), 'POST', settings).then(function(json) {
            success(json);
        });
    },

    //updateRecord: function(store, type, uri, snapshot) {
    update: function(type, uri, data, success, error, settings) {
        settings = settings || {};
        settings.data = data;
        settings.error = error;
        this.ajax(this._uri(type, uri), 'PUT', settings).then(function(json) {
            success(json);
        });
    },

    //deleteRecord: function(store, type, uri, snapshot) {
    delete: function(type, uri, success, error, settings) {
        settings = settings || {};
        settings.error = error;
        this.ajax(this._uri(type, uri), 'DELETE', settings).then(function(json) {
            success(json);
        });
    },

    ajax: function(url, type, settings) {
        settings = settings || {};
        settings.url = url;
        settings.type = type;
        settings.context = this;

        var alreadyHasAuth = settings.headers && settings.headers['Authorization'];

        // HACK this goes away when we have oAuth
        if (!alreadyHasAuth && url && url.indexOf(ENV.BALANCED.AUTH) === -1) {
            if (Auth.get('signedIn')) {
                var marketplaceId = BalancedApp.currentMarketplace ? BalancedApp.currentMarketplace.get('id') : null;

                var matches = MARKETPLACE_URI_REGEX.exec(url);
                if (matches) {
                    marketplaceId = matches[1];
                }

                var userMarketplace = Auth.get('user').user_marketplace_for_id(marketplaceId);

                if (!userMarketplace) {
                    if (marketplaceId) {
                        Ember.Logger.warn("Couldn't find user marketplace for ID %@ (url: %@)".fmt(marketplaceId, url));

                        // If we couldn't find the user marketplace, maybe this is an admin user, so hit the auth server to try to find the API secret
                        return Ajax.ajax({
                            url: ENV.BALANCED.AUTH + '/marketplaces/%@'.fmt(marketplaceId),
                            type: 'GET',
                            error: settings.error
                        }).then(function(response) {
                            Auth.addUserMarketplace(response.id, response.uri, response.name, response.secret);

                            settings.headers = settings.headers || {};
                            settings.headers['Authorization'] = Utils.encodeAuthorization(response.secret);
                            return Ajax.ajax(settings);
                        });
                    }
                } else if (!userMarketplace.get('secret')) {
                    userMarketplace.reload();
                } else {
                    var secret = userMarketplace.get('secret');
                    settings.headers = settings.headers || {};
                    settings.headers['Authorization'] = Utils.encodeAuthorization(secret);
                }
            }
        }

        return Ajax.ajax(settings);
    },

    load: function(settings) {
        var deferred = Ember.RSVP.defer();
        jQuery.ajax(settings).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    },*/
});

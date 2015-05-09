import Ember from "ember";
import BaseConnection from "./base-connection";
import ENV from "mb-test-1/config/environment";
import Utils from "mb-test-1/lib/utils";

var DEFAULT_SETTINGS = {
    dataType: 'json',
    contentType: 'application/json; charset=UTF-8',
    accepts: {
        json: 'application/vnd.cegesta+json; version=1.1'
    },
};

var ApiConnection = BaseConnection.extend({
    getEncodedAuthorization: function() {
        var apiKey = this.get("apiKey");
        return Utils.encodeAuthorization(apiKey);
    },

    isAuthorized: function() {
        return !Ember.isBlank(this.get("apiKey"));
    },

    settings: function(additionalSettings) {
        var headers = {};
        /*if (this.isAuthorized()) {
            headers["Authorization"] = this.getEncodedAuthorization();
        }*/
        var settings = _.extend({
            headers: headers
        }, DEFAULT_SETTINGS, additionalSettings);

        if (settings.data && settings.type.toUpperCase() !== "GET") {
            settings.data = JSON.stringify(settings.data);
        }
        return settings;
    },
});

export default ApiConnection;

import Ember from "ember";
import ENV from "mb-test-1/config/environment";
import COOKIE from "mb-test-1/utils/constants/cookie";
import AuthConnection from "./connections/auth-connection";
import ApiConnection from "./connections/api-connection";

export default Ember.Namespace.create({
    csrfToken: $.cookie(COOKIE.CSRF_TOKEN),
    defaultApiKey: null,

    loadCSRFToken: function() {
        var self = this;
        var deferred = Ember.RSVP.defer();
        // POSTing to / will return a csrf token
        this
            .ajax({
                type: 'POST',
                url: ENV.APP.API_HOST
            })
            .then(function(response) {
                self.csrfToken = response.csrf;
                deferred.resolve();
            });
        return deferred.promise;
    },

    loadCSRFTokenIfNotLoaded: function() {
        return this.csrfToken ?
            Ember.RSVP.resolve() :
            this.loadCSRFToken();
    },

    ajax: function(settings) {
        var connection = ApiConnection.create({});
        /*if (settings.url.indexOf(ENV.APP.API_HOST) >= 0) {
            connection = AuthConnection.create({
                csrfToken: this.csrfToken
            });
        } else {
            connection = ApiConnection.create({
                apiKey: this.defaultApiKey
            });
        }*/
        return connection.ajax(settings);
    }
});

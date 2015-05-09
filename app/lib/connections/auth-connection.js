import ENV from "mb-test-1/config/environment";
import BaseConnection from "./base-connection";

export default BaseConnection.extend({
    csrfToken: function() {
        var Ajax = require("mb-test-1/lib/ajax")["default"];
        return Ajax.csrfToken;
    }.property(),

    getCsrfToken: function() {
        return this.get("csrfToken");
    },

    settings: function(additionalSettings) {
        var settings = additionalSettings; /*_.extend({
            headers: {
                "X-CSRFToken": this.getCsrfToken()
            }
        }, additionalSettings);*/

        // This does NOT work in Firefox
        // See http://stackoverflow.com/questions/16668386/cors-synchronous-requests-not-working-in-firefox
        /* istanbul ignore if */
        /*if (!window.TESTING) {
            settings.xhrFields = {
                withCredentials: true
            };
        } else {
            settings.beforeSend = function(xhr) {
                xhr.withCredentials = true;
            };
        }*/
        return settings;
    }
});

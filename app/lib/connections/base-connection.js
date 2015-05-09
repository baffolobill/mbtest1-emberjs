import Ember from "ember";

export default Ember.Object.extend({
    settings: function(settings) {
        // This function can be overriden by descendant classes so they can add default arguments
        return settings;
    },

    post: function(url, data) {
        return this.ajax({
            url: url,
            data: data,
            type: "POST"
        });
    },

    delete: function(url) {
        return this.ajax({
            url: url,
            type: "DELETE"
        });
    },

    ajax: function(settings) {
        var Adapter = MbTestApp.__container__.lookup("adapter:main");
        return Adapter.load(this.settings(settings));
    }
});

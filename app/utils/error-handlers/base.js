import Ember from "ember";

export default Ember.Object.extend({
    addErrorMessage: function(key, message) {
        return this.model.get("validationErrors").add(key, "serverError", null, message);
    },

    clear: function() {
        return this.model.get("validationErrors").clear();
    }
});

import Ember from "ember";
import BaseErrorHandler from "./base";

//export default Ember.Object.extend(BaseErrorHandler, {
export default BaseErrorHandler.extend({
    init: function(model, response) {
        this.model = model;
        this.response = response;
    },

    getServerExtraKeyMapping: function(key) {
        switch (key) {
            case "incorporation_date":
                return "business.incorporation_date";
            case "tax_id":
                return "business.tax_id";
            case "dob":
                return "person.dob";
            default:
                return key;
        }
    },

    execute: function() {
        var errorsList;
        errorsList = this.response.errors || [];
        _.each(errorsList, (function(_this) {
            return function(error) {
                var message;
                if (_.keys(error.extras).length > 0) {
                    return _.each(error.extras, function(message, key) {
                        key = _this.getServerExtraKeyMapping(key);
                        return _this.addErrorMessage(key, message);
                    });
                } else if (error.additional) {
                    return _this.addErrorMessage(void 0, error.additional);
                } else if (error.description) {
                    if (error.description.indexOf(" - ") > 0) {
                        message = error.description.split(" - ")[1];
                    } else {
                        message = error.description;
                    }
                    return _this.addErrorMessage(void 0, message);
                } else {
                    return _this.addErrorMessage(void 0, error[0]);
                }
            };
        })(this));
        return this.model.notifyPropertyChange("validationErrors");
    }
});

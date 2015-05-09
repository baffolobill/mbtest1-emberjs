import Ember from "ember";

var getModelRootErrorMessages = function(model) {
    return model.get("validationErrors.length") ?
        "Your information could not be saved. Please correct the errors below." :
        "Your information could not be saved.";
};

var DisplayModelErrorsModalMixin = Ember.Mixin.create({
    updateErrorsBar: function() {
        var model = this.get("model");
        if (model.get("validationErrors.length")) {
            var errorMessage = getModelRootErrorMessages(model);
            if (errorMessage) {
                var controller = this.get("container").lookup("controller:modal_notification_center");
                controller.clearAlerts();
                controller.alertError(new Ember.Handlebars.SafeString(errorMessage));
            }
        }
    }.observes("model.validationErrors.allMessages"),
});

export default DisplayModelErrorsModalMixin;
